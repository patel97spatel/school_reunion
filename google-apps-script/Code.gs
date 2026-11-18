/*
 * Bind this script to your reunion spreadsheet. Run setupSheets once, then
 * deploy it as a web app that executes as you and is accessible to anyone.
 */
const HEADERS = {
  Friends: ["name", "then", "now", "status", "photo", "approved"],
  Memories: ["type", "title", "name", "message", "url", "approved", "submittedAt"],
  Votes: ["item", "name", "submittedAt"],
  Responses: ["name", "city", "interest", "opinion", "submittedAt"]
};
const MENU_ITEMS = ["rice", "dal", "chicken", "mutton", "paneer", "mushroom", "salad", "dahi-raita", "tomato-khatta"];

function setupSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function (name) {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]);
      sheet.setFrozenRows(1);
    } else {
      const actual = sheet.getRange(1, 1, 1, HEADERS[name].length).getValues()[0];
      if (actual.join("|") !== HEADERS[name].join("|")) {
        throw new Error("The " + name + " sheet already exists with different headers. Rename it before running setup.");
      }
    }
  });
  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", spreadsheet.getId());
}

function reunionSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Run setupSheets before deploying the web app.");
  return SpreadsheetApp.openById(id);
}

function rows(name) {
  const sheet = reunionSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error("Missing " + name + " sheet. Run setupSheets first.");
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS[name].length).getValues().map(function (row) {
    const result = {};
    HEADERS[name].forEach(function (key, index) { result[key] = row[index]; });
    return result;
  });
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function approved(value) {
  return String(value).trim().toUpperCase() === "YES";
}

function publicText(value) {
  return String(value == null ? "" : value);
}

function doGet() {
  try {
    const friends = rows("Friends").filter(function (row) { return approved(row.approved); }).map(function (row) {
      return { name: publicText(row.name), then: publicText(row.then), now: publicText(row.now), status: publicText(row.status), photo: publicText(row.photo) };
    });
    const memories = rows("Memories").filter(function (row) {
      return approved(row.approved) && ["photo", "video", "note"].indexOf(String(row.type).toLowerCase()) !== -1;
    }).map(function (row) {
      return { type: String(row.type).toLowerCase(), title: publicText(row.title), name: publicText(row.name), message: publicText(row.message), url: publicText(row.url) };
    }).reverse();
    const votes = rows("Votes").filter(function (row) { return MENU_ITEMS.indexOf(String(row.item)) !== -1; }).map(function (row) {
      return { item: publicText(row.item), name: publicText(row.name) };
    });
    return json({ ok: true, friends: friends, memories: memories, votes: votes });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Could not read the spreadsheet. Ask the organiser to check the setup." });
  }
}

function field(value, name, maximum, required) {
  if (typeof value !== "string") {
    if (required) throw new Error(name + " is required.");
    return "";
  }
  const text = value.trim();
  if (required && !text) throw new Error(name + " is required.");
  if (text.length > maximum) throw new Error(name + " is too long.");
  // Prevent submitted text from being interpreted as a spreadsheet formula.
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function doPost(event) {
  let lock;
  try {
    if (!event || !event.postData || !event.postData.contents) throw new Error("Missing submission.");
    const request = JSON.parse(event.postData.contents);
    const name = field(request.name, "Name", 80, true);
    let sheetName;
    let values;
    let message;
    if (request.action === "vote") {
      if (MENU_ITEMS.indexOf(request.item) === -1) throw new Error("Please choose a valid menu item.");
      sheetName = "Votes";
      values = [request.item, name, new Date()];
      message = "Your vote has been recorded!";
    } else if (request.action === "rsvp") {
      const interest = field(request.interest, "Interest", 80, true);
      if (["Yes, absolutely!", "Maybe, keep me posted", "Not this time"].indexOf(interest) === -1) throw new Error("Please choose an interest option.");
      sheetName = "Responses";
      values = [name, field(request.city, "City", 80, false), interest, field(request.opinion, "Opinion", 1000, false), new Date()];
      message = "Thanks! Your response has been sent to the organiser.";
    } else if (request.action === "story") {
      sheetName = "Memories";
      values = ["note", "A note from " + name, name, field(request.message, "Message", 1000, true), "", "NO", new Date()];
      message = "Thanks! Your message has been sent for review.";
    } else {
      throw new Error("Unknown submission type.");
    }
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const sheet = reunionSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error("The spreadsheet is not set up.");
    sheet.appendRow(values);
    return json({ ok: true, message: message });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: error.message || "Could not save your response." });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
