(() => {
  "use strict";
  const config = window.REUNION_CONFIG;
  const menu = [
    { id: "rice", name: "Rice", emoji: "🍚" },
    { id: "dal", name: "Dal", emoji: "🥣" },
    { id: "chicken", name: "Chicken", emoji: "🍗" },
    { id: "mutton", name: "Mutton", emoji: "🍲" },
    { id: "paneer", name: "Paneer", emoji: "🍛" },
    { id: "mushroom", name: "Mushroom", emoji: "🍄" },
    { id: "salad", name: "Salad", emoji: "🥗" },
    { id: "dahi-raita", name: "Dahi raita", emoji: "🥛" },
    { id: "tomato-khatta", name: "Tomato khatta", emoji: "🍅" }
  ];
  const demo = !config.apiUrl;
  const demoKey = "backbench-club-demo-v1";
  const sampleMemories = [
    { type: "photo", title: "The days we'll never forget", name: "The gang", message: "Here's to the people who made the ordinary days extraordinary.", url: "assets/images/friends-running.jpg" },
    { type: "photo", title: "Together is our favourite place", name: "The gang", message: "A little reminder to make time for the people who feel like home.", url: "assets/images/school-cricket.jpg" },
    { type: "note", title: "A note to the old gang", name: "The happy wall", message: "No matter how much time passes, good friends always pick up right where they left off.", url: "" }
  ];
  let data = { friends: [], memories: [], votes: [] };
  let activeFilter = "all";
  let selectedSlide = 0;
  let currentPage = 1;
  const itemsPerPage = 10;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const safeUrl = value => {
    if (/^assets\/images\/[a-z0-9][a-z0-9._-]*$/i.test(value)) return value;
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch { return ""; }
  };
  const notify = message => {
    const notice = $("#notice");
    notice.textContent = message;
    notice.classList.add("visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => notice.classList.remove("visible"), 6000);
  };

  function getDemoData() {
    const saved = localStorage.getItem(demoKey);
    if (!saved) {
      const defaultFriends = [
        { srNo: 1, name: "Akash", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 2, name: "Dilip", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 3, name: "Debashish (1)", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 4, name: "Madan", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 5, name: "Biki", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 6, name: "Aloka", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 7, name: "Sashika", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 8, name: "Biku", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 9, name: "Dharmananda", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 10, name: "Rohita", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 11, name: "Bulu", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 12, name: "Jenamani", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 13, name: "Debashish (2)", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 14, name: "Tilu", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 15, name: "Dola", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 16, name: "Parkhita", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 17, name: "Biren", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 18, name: "Deepak", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 19, name: "Kunta", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 20, name: "Anil", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 21, name: "Ghana", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 22, name: "Akash (2)", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 23, name: "Sunil Kharsel", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 24, name: "Naren", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 25, name: "Nirmala", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 26, name: "Hemanta", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 27, name: "Sujit", contact: "+91 XXX-XXX-XXXX" },
        { srNo: 28, name: "Bikash", contact: "+91 XXX-XXX-XXXX" }
      ];
      return { friends: defaultFriends, memories: sampleMemories, votes: [] };
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.votes) || !Array.isArray(parsed.memories)) throw new Error("Demo data is invalid.");
    return { friends: parsed.friends || [], memories: parsed.memories, votes: parsed.votes };
  }

  async function request(payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(config.apiUrl, payload ? {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller.signal
      } : { signal: controller.signal });
      if (!response.ok) throw new Error(`Server returned ${response.status}.`);
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "The server could not process your request.");
      return result;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("The request timed out. Check your connection and try again.");
      throw error;
    } finally { clearTimeout(timer); }
  }

  async function loadData() {
    if (demo) {
      data = getDemoData();
    } else {
      const result = await request();
      if (!Array.isArray(result.friends) || !Array.isArray(result.memories) || !Array.isArray(result.votes)) throw new Error("The server returned an invalid response.");
      data = { friends: result.friends, memories: result.memories, votes: result.votes };
    }
    renderTable();
    renderMemories();
    renderVotes();
  }

  async function submit(action, values) {
    if (demo) {
      if (action === "vote") {
        data.votes.push({ item: values.item, name: values.name });
        localStorage.setItem(demoKey, JSON.stringify({ votes: data.votes, memories: data.memories }));
      }
      return { message: action === "vote" ? "Demo vote saved in this browser only." : "Demo only: your response was not sent or saved. Connect Google Sheets to collect responses." };
    }
    return request({ action, ...values });
  }

  function renderTable() {
    const query = $("#friend-search").value.trim().toLowerCase();
    let friends = data.friends.filter(friend => [friend.name, friend.contact].some(value => String(value || "").toLowerCase().includes(query)));
    
    friends.sort((a, b) => {
      const nameA = String(a.name || "").toUpperCase();
      const nameB = String(b.name || "").toUpperCase();
      return nameA.localeCompare(nameB);
    });
    
    const totalPages = Math.ceil(friends.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFriends = friends.slice(startIndex, startIndex + itemsPerPage);
    
    $("#friends-table").innerHTML = paginatedFriends.map(friend => `<tr><td>${friend.srNo || "—"}</td><td>${escapeHtml(friend.name)}</td><td>${escapeHtml(friend.contact || "—")}</td></tr>`).join("") || `<tr><td colspan="3">${query ? "No friends found." : "No friends have been added yet."}</td></tr>`;
    
    $("#page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    $("#prev-page").disabled = currentPage === 1;
    $("#next-page").disabled = currentPage === totalPages;
    
    $("#friend-count").textContent = `${friends.length} ${friends.length === 1 ? "friend" : "friends"}${query ? " found" : ""}`;
  }

  function renderMemories() {
    const memories = data.memories.filter(memory => activeFilter === "all" || memory.type === activeFilter);
    $("#memories-grid").innerHTML = memories.map(memory => {
      const url = safeUrl(memory.url);
      let visual = `<div class="note-memory">“${escapeHtml(memory.message || "Good friends, great memories.")}”</div>`;
      if (memory.type === "photo" && url) visual = `<div class="memory-image"><img src="${escapeHtml(url)}" alt="${escapeHtml(memory.title || "Shared memory")}" loading="lazy"><span class="memory-type">PHOTO ✳</span></div>`;
      if (memory.type === "video") visual = `<div class="note-memory">▶<br>Press play on a memory.</div>`;
      return `<article class="memory-card">${visual}<div class="memory-body"><small>${escapeHtml(memory.type === "note" ? "THE HAPPY WALL" : memory.type)} · ${escapeHtml(memory.name || "A friend")}</small><h3>${escapeHtml(memory.title || "A little memory")}</h3><p>${escapeHtml(memory.message)}</p>${memory.type === "video" && url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Watch video ↗</a>` : ""}</div></article>`;
    }).join("") || '<p class="empty-state">No memories here yet. Be the first to share one!</p>';
  }

  function renderVotes() {
    const ranked = menu.map(item => ({ ...item, count: data.votes.filter(vote => vote.item === item.id).length })).sort((a, b) => b.count - a.count);
    $("#vote-grid").innerHTML = ranked.map((item, index) => `<article class="vote-card"><div class="vote-top"><span class="vote-emoji" aria-hidden="true">${item.emoji}</span><span class="vote-rank">${item.count ? `#${index + 1} MOST LOVED` : "ON THE MENU"}</span></div><h3>${item.name}</h3><p>${item.count} ${item.count === 1 ? "vote" : "votes"}</p><button type="button" data-vote="${item.id}">See votes &amp; vote <span>↗</span></button></article>`).join("");
  }

  function showVotes(id) {
    const item = menu.find(entry => entry.id === id);
    if (!item) return;
    $("#vote-modal-title").textContent = item.name;
    $('#vote-form [name="item"]').value = id;
    const names = data.votes.filter(vote => vote.item === id).map(vote => vote.name);
    $("#voter-list").innerHTML = names.length ? names.map(name => `<li>${escapeHtml(name)}</li>`).join("") : "<li>No votes yet. Be the first!</li>";
    $("#vote-form .form-status").textContent = "";
    $("#vote-modal").showModal();
  }

  function attachForm(selector, action) {
    const form = $(selector);
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const status = $(".form-status", form);
      const button = $('button[type="submit"]', form);
      const values = Object.fromEntries(new FormData(form).entries());
      button.disabled = true;
      status.textContent = "Sending...";
      try {
        const result = await submit(action, values);
        status.textContent = result.message;
        if (action === "vote") {
          renderVotes();
          const names = data.votes.filter(vote => vote.item === values.item).map(vote => vote.name);
          if (!demo) {
            try {
              await loadData();
            } catch (error) {
              status.textContent = `${result.message} The results could not be refreshed: ${error.message}`;
              return;
            }
          }
          const updatedNames = demo ? names : data.votes.filter(vote => vote.item === values.item).map(vote => vote.name);
          $("#voter-list").innerHTML = updatedNames.map(name => `<li>${escapeHtml(name)}</li>`).join("");
          form.elements.name.value = "";
        } else if (!demo) form.reset();
      } catch (error) {
        status.textContent = `Could not send: ${error.message}`;
      } finally { button.disabled = false; }
    });
  }

  function openWhatsApp() {
    const number = String(config.whatsapp || "").replace(/\D/g, "");
    if (!number) {
      notify("The organiser hasn't added a WhatsApp number yet. Please check back soon.");
      return;
    }
    const message = "Hi! I have a memory to share with the school reunion. I'll attach my photos, videos or documents here.";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function showSlide(index) {
    selectedSlide = index;
    $$(".hero-slide").forEach((slide, i) => { slide.classList.toggle("is-active", i === index); slide.setAttribute("aria-hidden", String(i !== index)); });
    $$(".slide-dot").forEach((dot, i) => { dot.classList.toggle("active", i === index); dot.setAttribute("aria-pressed", String(i === index)); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-setting]").forEach(element => { element.textContent = config[element.dataset.setting] || element.textContent; });
    $("#year").textContent = new Date().getFullYear();
    $(".nav-toggle").addEventListener("click", event => {
      const open = $("#main-nav").classList.toggle("open");
      event.currentTarget.setAttribute("aria-expanded", String(open));
    });
    $$("#main-nav a").forEach(link => link.addEventListener("click", () => { $("#main-nav").classList.remove("open"); $(".nav-toggle").setAttribute("aria-expanded", "false"); }));
    $$(".slide-dot").forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const slideCount = $$(".hero-slide").length;
      setInterval(() => showSlide((selectedSlide + 1) % slideCount), 6500);
    }
    $("#friend-search").addEventListener("input", () => {
      currentPage = 1;
      renderTable();
    });
    $("#prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
    $("#next-page").addEventListener("click", () => {
      currentPage++;
      renderTable();
    });
    $$(".filter-btn").forEach(button => button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      $$(".filter-btn").forEach(entry => entry.classList.toggle("active", entry === button));
      renderMemories();
    }));
    $("#vote-grid").addEventListener("click", event => { const button = event.target.closest("[data-vote]"); if (button) showVotes(button.dataset.vote); });
    $$("[data-open]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.open).showModal()));
    $$(".close-modal").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
    $("#whatsapp-button").addEventListener("click", openWhatsApp);
    $(".footer-whatsapp").addEventListener("click", openWhatsApp);
    attachForm("#rsvp-form", "rsvp");
    attachForm("#story-form", "story");
    attachForm("#vote-form", "vote");
    
    loadData().catch(error => {
      $("#friends-table").innerHTML = '<tr><td colspan="3">Could not load the friends list.</td></tr>';
      $("#memories-grid").innerHTML = '<p class="empty-state">Could not load memories.</p>';
      $("#vote-grid").innerHTML = '<p class="empty-state">Could not load voting results.</p>';
      notify(`Could not load reunion data: ${error.message}`);
    });
  });
})();
