# Golden Days Forever — School Friends Reunion

A responsive HTML, CSS, JavaScript and Bootstrap reunion website. It has a “Friends Forever” banner carousel, scroll-triggered entrance animations that respect reduced-motion settings, a static reunion quote, a warm gradient theme, school details, supplied school-memory photos, a searchable friends directory, photo/video and happy-wall filters, a feast vote with voter names, reunion opinions, and a WhatsApp sharing link.

## Try it

Open `index.html` in a browser, or serve this folder with a static web server. The first run is **demo mode**: a sample friends list appears, and votes and food preference counts are saved only in that browser; other submissions are not saved. Visitors do not share demo data. Clear the browser's site data to reset demo votes and preference counts.

To share persistent counts between visitors, the organiser must complete the Google Sheets setup below and publish the site with its `apiUrl` configured. Demo votes and preferences remain in their original browser and are not transferred to the sheet. Shared counts are loaded when visitors open or reload the page; they are not updated automatically while the page stays open.

## Make it yours

Edit `assets/js/config.js`:

- `school`, `location` and `batch`: your school names, location and batch details.
- `owner`: your name, displayed beside the current year in the footer.
- `whatsapp`: your WhatsApp number with country code and no `+`, spaces, or punctuation, e.g. `919876543210`. This example is not a real contact. The memory-sharing button and group-join form use this number.
- `whatsappFeast`: an optional separate WhatsApp number in the same format for feast RSVPs. The feast RSVP section uses this number to open a prefilled message with the visitor's attendance and optional feedback. Requests are not stored by the site; the visitor must send the WhatsApp message. If unset, the feast RSVP form reports that WhatsApp is unavailable.
- `apiUrl`: your deployed Google Apps Script web app URL, set up below.

The feast menu includes rice, dal, chicken, mutton, paneer, mushroom, salad, dahi raita, tomato khatta, papad, Pakhalbhat, Tomato puda, Alu puda, tea, Chaulbara and Jhal Mudhi. To change the choices, update **both** `menu` in `assets/js/app.js` and `MENU_ITEMS` in `google-apps-script/Code.gs`, then redeploy the script. Existing votes use the item IDs, so keep IDs stable when renaming choices. Votes for the previous example menu remain in the sheet but are no longer shown or counted. If you have already deployed the backend, update its code and deploy a new version before accepting votes for the new menu.

The supplied school-memory photos are stored in `assets/images` and used in the banner, class cards, story section and demo memories. Replace them with photos you have permission to use by updating their image paths and `alt` text in `index.html` and the demo-memory URLs in `assets/js/app.js`. Banner `--hero-image` paths are relative to `assets/css/style.css`, so images in `assets/images` use `../images/`. Use images with permission from everyone pictured. Google Fonts and Bootstrap are loaded from CDNs; the custom CSS supplies the site's core styling.

The feast RSVP section uses supplied reunion photos from `assets/images/feast-rsvp-*.jpeg`. The main photo cycles every three seconds, and the thumbnails can be selected manually. Automatic rotation pauses when reduced motion is enabled.

Banner photos are from Pexels, under the [Pexels license](https://www.pexels.com/license/):

- [School friends](https://www.pexels.com/photo/happy-school-children-in-india-celebrating-together-40582287/) by Rohan Batra.
- [Schoolyard play](https://www.pexels.com/photo/joyful-children-playing-outdoors-in-assam-schoolyard-37815945/) by Mangalam Bhargava.
- [School cricket](https://www.pexels.com/photo/students-on-brown-field-near-fence-5909583/) by Plato Terentev.
- [Children with a bicycle](https://www.pexels.com/photo/children-playing-with-bicycle-in-indian-village-30969804/) by Anil Sharma.

The story gallery uses illustrative images, not actual photos of the school or its teachers. The school-ground, midday-meal and morning-prayer images were supplied by the site owner; confirm permission to use them and consent from the people pictured before publishing. The other photos are from Pexels:

- [Classroom](https://www.pexels.com/photo/children-sitting-in-a-classroom-with-desks-and-chairs-18012456/) by Swastik Arora.
- [Teacher and student](https://www.pexels.com/photo/teacher-writing-on-a-blackboard-beside-a-student-7521313/) by Pavel Danilyuk.

## Free shared Google Sheets setup

Google Sheets stores shared data and can be downloaded as an Excel workbook. A Google account is required for the organiser; no Google sign-in is required for visitors.

1. Create a new Google Sheet. Keep it private; do **not** publish or share the spreadsheet publicly.
2. In that sheet, open **Extensions → Apps Script**. Replace the default code with `google-apps-script/Code.gs` and save.
3. Select `setupSheets` and run it. Authorise the requested permissions for your own spreadsheet. This creates the `Friends`, `Memories`, `Votes`, `Preferences` and `Responses` tabs and records the spreadsheet ID for the web app. If you have already set up the spreadsheet, run `setupSheets` again after updating the script; it adds the `Preferences` tab without changing existing data. If a tab already exists with different headers, rename it first.
4. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Deploy and copy the web app URL ending in `/exec`, not the `/dev` URL. Enter it as `apiUrl` in `assets/js/config.js`.
5. Test using the hosted site: cast a food vote, submit a food preference, and submit a message. Check the corresponding tabs. When editing Apps Script later, create a **new deployment version** via **Deploy → Manage deployments**, so the existing URL uses your updates.
6. To export, open the spreadsheet and choose **File → Download → Microsoft Excel (.xlsx)**.

If loading or submission fails, the site shows an error instead of switching to demo data. Check deployment access, the `/exec` URL, Google permissions and the Apps Script execution log. Apps Script and Google Sheets have free usage quotas and require internet access; the site does not provide unlimited storage or guaranteed availability.

### Populate and moderate

- **Food preferences:** each veg/non-veg submission adds one count to the `Preferences` sheet. Repeated submissions count again; no names are stored. Food votes remain in the separate `Votes` sheet and are not cleared by preference submissions.
- **Friends:** add one row per friend: `name`, `then` (e.g. a nickname or school memory), `now` (e.g. city), `status`, optional `photo` (a public HTTPS image URL shown as a circular profile photo), and `approved` = `YES`. Without a custom photo, the site assigns a consistent illustrated avatar from the roster's assigned avatar group. Only approved rows appear in the searchable list. Contact details are not shown or searchable.
- **Memories:** submitted happy-wall notes arrive with `approved` = `NO`. Review them, then set `approved` to `YES` to publish. To add media received on WhatsApp, add a row with `type` = `photo` or `video`, a title, name, message and public HTTPS `url`, and `approved` = `YES`. Photo URLs must point directly to an image. Videos open as links in a new tab; use a video host that allows your friends to view it. Files are **not** uploaded to the spreadsheet or automatically transferred from WhatsApp.
- **Votes:** every vote and the name entered are public on the website. Votes are sorted by count; selecting a dish opens the list of names. There is no login or enforced one-vote-per-person limit. Anyone can submit duplicate votes or another name, so results are informal, not tamper-proof. Remove inappropriate rows from the sheet.
- **Responses:** the current site no longer submits reunion responses to the sheet. Group-join requests are sent only when visitors send the prefilled WhatsApp message to the organiser.

Only publish friends, names, photos and messages with the people involved's consent. The site and its public web app have no authentication, CAPTCHA or rate limiting: anyone with the URL can view published data and submit responses, and spam or quota exhaustion is possible. Review submissions regularly; don't collect sensitive information or use this setup for private or high-stakes voting.

## Host for free

Upload `index.html` and the complete `assets` folder to any static host, such as GitHub Pages, Netlify, or Cloudflare Pages. Configure the deployment's publish directory as the project root and visit the HTTPS URL. The `google-apps-script` folder is for setup and does not need to be published. Hosting and Google account terms, quotas and availability may change.

## Files

- `index.html` — page structure.
- `assets/css/style.css` — responsive theme.
- `assets/js/config.js` — school, copyright, WhatsApp and backend settings.
- `assets/js/app.js` — carousel, directory, memories, voting and forms.
- `google-apps-script/Code.gs` — Google Sheets backend.
