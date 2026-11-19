(() => {
  "use strict";
  const config = window.REUNION_CONFIG;
  const menu = [
    { id: "rice", name: "Rice", image: "assets/images/feast-rice.jpeg", imageAlt: "A bowl of coconut jasmine rice with fresh herbs" },
    { id: "dal", name: "Dal", image: "assets/images/feast-moong-dal.jpeg", imageAlt: "Yellow moong dal tadka served in a bowl" },
    { id: "chicken", name: "Chicken", image: "assets/images/feast-malwani-chicken.jpeg", imageAlt: "Malwani chicken curry garnished with fresh herbs" },
    { id: "mutton", name: "Mutton", image: "assets/images/feast-mutton-curry.jpeg", imageAlt: "Spicy mutton curry served in a metal bowl" },
    { id: "paneer", name: "Paneer", image: "assets/images/feast-paneer-curry.jpeg", imageAlt: "Paneer curry garnished with fresh herbs" },
    { id: "mushroom", name: "Mushroom", image: "assets/images/feast-mushroom.jpeg", imageAlt: "Roasted mushrooms with herbs in a pan" },
    { id: "salad", name: "Salad", image: "assets/images/feast-salad.jpeg", imageAlt: "Fresh salad with cucumber, tomato and onion" },
    { id: "dahi-raita", name: "Dahi raita", image: "assets/images/feast-raita.jpeg", imageAlt: "A bowl of cucumber raita" },
    { id: "tomato-khatta", name: "Tomato khatta", image: "assets/images/feast-tomato.jpeg", imageAlt: "A bowl of tomato sauce with herbs" },
    { id: "papad", name: "Papad", image: "assets/images/feast-papad.jpeg", imageAlt: "A stack of crisp papad" },
    { id: "pakhalbhat", name: "Pakhalbhat", image: "assets/images/feast-pakhal-bhat.jpeg", imageAlt: "A traditional Odia meal served with dahi pakhala" },
    { id: "patal-puda", name: "Tomato puda", image: "assets/images/feast-tomato-puda.jpeg", imageAlt: "Tomatoes roasted over hot coals" },
    { id: "alu-puda", name: "Alu puda", image: "assets/images/feast-alu-puda.jpeg", imageAlt: "Potatoes roasting in hot coals" },
    { id: "tea", name: "Tea", image: "assets/images/feast-tea.jpeg", imageAlt: "Two glasses of hot tea" },
    { id: "chaulbara", name: "Chaulbara", image: "assets/images/feast-chaulbar.jpeg", imageAlt: "Chaulbara served on a leaf plate" },
    { id: "mudhi-mixture", name: "Jhal Mudhi", image: "assets/images/feast-jhal-mudhi.jpeg", imageAlt: "A bowl of Jhal Mudhi with vegetables and peanuts" }
  ];
  const friendAvatarPhotos = {
    boys: [
      "assets/images/friend-avatar-boy-1.jpeg",
      "assets/images/friend-avatar-boy-2.jpeg",
      "assets/images/friend-avatar-boy-3.png",
      "assets/images/friend-avatar-boy-4.png"
    ],
    girls: [
      "assets/images/friend-avatar-girl-1.png",
      "assets/images/friend-avatar-girl-2.jpeg",
      "assets/images/friend-avatar-girl-3.jpeg",
      "assets/images/friend-avatar-girl-4.jpeg"
    ]
  };
  const girlFriendNames = new Set(["Jyoti", "Nandini", "Nandini II", "Niladri", "Parbati", "Priti", "Rukmini", "Sasmita", "Tapa"].map(name => name.toLowerCase()));
  const legacyFriendNames = {
    "akash khamari": "Akash II",
    "akash (2)": "Akash II",
    "akash(2)": "Akash II",
    "akask(2)": "Akash II",
    "debashis (1)": "Debashis - I",
    "debashish (1)": "Debashis - I",
    "debashish(1)": "Debashis - I",
    "debashish (2)": "Debashish II",
    "nandini jal": "Nandini II"
  };
  const demo = !config.apiUrl;
  const demoKey = "backbench-club-demo-v5";
  const sampleMemories = [
    { type: "photo", title: "The days we'll never forget", name: "The gang", message: "Here's to the people who made the ordinary days extraordinary.", url: "assets/images/friends-running.jpg" },
    { type: "photo", title: "Together is our favourite place", name: "The gang", message: "A little reminder to make time for the people who feel like home.", url: "assets/images/school-cricket.jpg" },
    { type: "note", title: "A note to the old gang", name: "The happy wall", message: "No matter how much time passes, good friends always pick up right where they left off.", url: "" }
  ];
  let data = { friends: [], memories: [], votes: [], preferences: null };
  let preferenceSubmitting = false;
  let activeFilter = "all";
  let selectedSlide = 0;
  let currentPage = 1;
  let scrollRevealObserver = null;
  const itemsPerPage = 10;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const scrollRevealSelector = [
    ".hero-content > *", ".hero-stamp", ".reunion-quote", ".school-strip > *",
    ".feast-rsvp-section .section-label", ".feast-rsvp-feature",
    ".about-section .section-label", ".about-grid > *",
    ".friends-section .section-label", ".friends-section .section-heading",
    ".class-grid .friend-card", ".class-photo-note", ".directory",
    ".memories-section .section-label", ".memories-section .section-heading",
    ".memory-tabs", ".memories-grid > *", ".share-banner",
    ".vote-section .section-label", ".vote-heading > *", ".vote-grid > *", ".vote-foot",
    ".rsvp-section .section-label", ".rsvp-grid > *",
    ".footer-top > *", ".footer-bottom"
  ].join(",");
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const safeUrl = value => {
    if (/^assets\/images\/[a-z0-9][a-z0-9._-]*$/i.test(value)) return value;
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch { return ""; }
  };
  const friendName = value => {
    const name = String(value || "Friend").trim().replace(/\s+/g, " ");
    return legacyFriendNames[name.toLowerCase()] || name;
  };
  const friendAvatarPhoto = name => {
    let hash = 0;
    for (let index = 0; index < name.length; index++) hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
    const group = girlFriendNames.has(name.toLowerCase()) ? friendAvatarPhotos.girls : friendAvatarPhotos.boys;
    return group[hash % group.length];
  };
  function setupScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (!scrollRevealObserver) {
      scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
    }
    $$(scrollRevealSelector).forEach(element => {
      if (element.classList.contains("scroll-reveal")) return;
      const siblingIndex = Array.from(element.parentElement.children).indexOf(element);
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 4) * 70}ms`);
      element.classList.add("scroll-reveal");
      scrollRevealObserver.observe(element);
    });
  }
  function unobserveScrollReveal(root) {
    if (!scrollRevealObserver) return;
    $$(".scroll-reveal", root).forEach(element => scrollRevealObserver.unobserve(element));
  }
  const notify = message => {
    const notice = $("#notice");
    notice.textContent = message;
    notice.classList.add("visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => notice.classList.remove("visible"), 6000);
  };

  function getDemoData() {
    const saved = localStorage.getItem(demoKey);
    const defaultFriends = [
        { srNo: 1, name: "Akash" },
        { srNo: 2, name: "Dilip" },
        { srNo: 3, name: "Debashis - I" },
        { srNo: 4, name: "Madan" },
        { srNo: 5, name: "Biki" },
        { srNo: 6, name: "Aloka" },
        { srNo: 7, name: "Sashika" },
        { srNo: 8, name: "Biku" },
        { srNo: 9, name: "Dharmananda" },
        { srNo: 10, name: "Rohita" },
        { srNo: 11, name: "Bulu" },
        { srNo: 12, name: "Jenamani" },
        { srNo: 13, name: "Debashish II" },
        { srNo: 14, name: "Tilu" },
        { srNo: 15, name: "Dola" },
        { srNo: 16, name: "Parkhita" },
        { srNo: 17, name: "Biren" },
        { srNo: 18, name: "Deepak" },
        { srNo: 19, name: "Kunta" },
        { srNo: 20, name: "Anil" },
        { srNo: 21, name: "Ghana" },
        { srNo: 22, name: "Akash II" },
        { srNo: 23, name: "Sunil Kharsel" },
        { srNo: 24, name: "Naren" },
        { srNo: 25, name: "Nirmala" },
        { srNo: 26, name: "Hemanta" },
        { srNo: 27, name: "Sujit" },
        { srNo: 28, name: "Bikash" },
        { srNo: 29, name: "Niladri" },
        { srNo: 30, name: "Tapa" },
        { srNo: 31, name: "Nandini" },
        { srNo: 32, name: "Jyoti" },
        { srNo: 33, name: "Sasmita" },
        { srNo: 34, name: "Priti" },
        { srNo: 35, name: "Nandini II" },
        { srNo: 36, name: "Rukmini" },
        { srNo: 37, name: "Parbati" },
        { srNo: 38, name: "Tribhuban" }
    ];
    if (!saved) return { friends: defaultFriends, memories: sampleMemories, votes: [], preferences: { veg: 0, nonVeg: 0 } };
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.votes) || !Array.isArray(parsed.memories)) throw new Error("Demo data is invalid.");
    const preferences = parsed.preferences === undefined ? { veg: 0, nonVeg: 0 } : parsed.preferences;
    if (!validPreferences(preferences)) throw new Error("Demo preference counts are invalid.");
    return { friends: parsed.friends || defaultFriends, memories: parsed.memories, votes: parsed.votes, preferences };
  }

  function validPreferences(counts) {
    return counts && Number.isSafeInteger(counts.veg) && counts.veg >= 0 &&
      Number.isSafeInteger(counts.nonVeg) && counts.nonVeg >= 0;
  }

  function renderPreferences() {
    const counts = data.preferences;
    $("#veg-count").textContent = counts ? counts.veg : "—";
    $("#non-veg-count").textContent = counts ? counts.nonVeg : "—";
    $("#food-preference-note").textContent = counts
      ? (demo ? "Demo only: counts are saved in this browser and are not shared." : "Counts are shared with all visitors.")
      : "Food preferences are unavailable. The organiser must update the spreadsheet setup.";
    $('#food-preference-form button[type="submit"]').disabled = !counts || preferenceSubmitting;
  }

  function saveDemoData() {
    localStorage.setItem(demoKey, JSON.stringify(data));
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
      } : { signal: controller.signal, cache: "no-store" });
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
      if (result.preferences != null && !validPreferences(result.preferences)) throw new Error("The server returned invalid preference counts.");
      data = { friends: result.friends, memories: result.memories, votes: result.votes, preferences: result.preferences || null };
    }
    renderTable();
    renderMemories();
    renderVotes();
    renderPreferences();
  }

  async function submit(action, values) {
    if (demo) {
      if (action === "vote") {
        data.votes.push({ item: values.item, name: values.name });
        try {
          saveDemoData();
        } catch (error) {
          data.votes.pop();
          throw error;
        }
      }
      return { message: action === "vote" ? "Demo vote saved in this browser only." : "Demo only: your response was not sent or saved. Connect Google Sheets to collect responses." };
    }
    return request({ action, ...values });
  }

  function attachPreferenceForm() {
    const form = $("#food-preference-form");
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const status = $(".form-status", form);
      const diet = new FormData(form).get("diet");
      if (!data.preferences || !["veg", "non-veg"].includes(diet)) {
        status.textContent = "Please choose a food preference when counts are available.";
        return;
      }
      preferenceSubmitting = true;
      renderPreferences();
      status.textContent = "Saving...";
      try {
        if (demo) {
          const previous = data.preferences;
          data.preferences = { ...previous, [diet === "veg" ? "veg" : "nonVeg"]: previous[diet === "veg" ? "veg" : "nonVeg"] + 1 };
          try {
            saveDemoData();
          } catch (error) {
            data.preferences = previous;
            throw error;
          }
          status.textContent = "Demo preference saved in this browser only.";
        } else {
          const result = await request({ action: "preference", diet });
          if (!validPreferences(result.preferences)) {
            data.preferences = null;
            throw new Error("Your preference was saved, but the server returned invalid counts. Reload the page to check them.");
          }
          data.preferences = result.preferences;
          status.textContent = result.message;
        }
        form.reset();
      } catch (error) {
        status.textContent = `Could not update counts: ${error.message}`;
      } finally {
        preferenceSubmitting = false;
        renderPreferences();
      }
    });
  }

  function renderTable() {
    const query = $("#friend-search").value.trim().toLowerCase();
    let friends = data.friends.map(friend => ({ ...friend, name: friendName(friend.name) }))
      .filter(friend => String(friend.name || "").toLowerCase().includes(query));
    
    friends.sort((a, b) => {
      const nameA = String(a.name || "").toUpperCase();
      const nameB = String(b.name || "").toUpperCase();
      return nameA.localeCompare(nameB);
    });
    
    const totalPages = Math.ceil(friends.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFriends = friends.slice(startIndex, startIndex + itemsPerPage);
    
    $("#friends-table").innerHTML = paginatedFriends.map((friend, index) => {
      const serNo = startIndex + index + 1;
      const name = String(friend.name || "Friend");
      const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase() || "?";
      const photo = safeUrl(String(friend.photo || "")) || friendAvatarPhoto(name);
      const avatar = photo
        ? `<img class="friend-avatar friend-avatar-photo" src="${escapeHtml(photo)}" alt="" data-initials="${escapeHtml(initials)}" loading="lazy">`
        : `<span class="friend-avatar friend-avatar-placeholder" aria-hidden="true">${escapeHtml(initials)}</span>`;
      return `<tr><td>${serNo}</td><td>${avatar}</td><td>${escapeHtml(name)}</td></tr>`;
    }).join("") || `<tr><td colspan="3">${query ? "No friends found." : "No friends have been added yet."}</td></tr>`;
    $$(".friend-avatar-photo", $("#friends-table")).forEach(image => {
      image.addEventListener("error", () => {
        const fallback = document.createElement("span");
        fallback.className = "friend-avatar friend-avatar-placeholder";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = image.dataset.initials;
        image.replaceWith(fallback);
      }, { once: true });
    });
    
    $("#page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    $("#prev-page").disabled = currentPage === 1;
    $("#next-page").disabled = currentPage === totalPages;
    
    $("#friend-count").textContent = `${friends.length} ${friends.length === 1 ? "friend" : "friends"}${query ? " found" : ""}`;
  }

  function renderMemories() {
    const memories = data.memories.filter(memory => activeFilter === "all" || memory.type === activeFilter);
    const grid = $("#memories-grid");
    unobserveScrollReveal(grid);
    grid.innerHTML = memories.map(memory => {
      const url = safeUrl(memory.url);
      let visual = `<div class="note-memory">“${escapeHtml(memory.message || "Good friends, great memories.")}”</div>`;
      if (memory.type === "photo" && url) visual = `<div class="memory-image"><img src="${escapeHtml(url)}" alt="${escapeHtml(memory.title || "Shared memory")}" loading="lazy"><span class="memory-type">PHOTO ✳</span></div>`;
      if (memory.type === "video") visual = `<div class="note-memory">▶<br>Press play on a memory.</div>`;
      return `<article class="memory-card">${visual}<div class="memory-body"><small>${escapeHtml(memory.type === "note" ? "THE HAPPY WALL" : memory.type)} · ${escapeHtml(memory.name || "A friend")}</small><h3>${escapeHtml(memory.title || "A little memory")}</h3><p>${escapeHtml(memory.message)}</p>${memory.type === "video" && url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Watch video ↗</a>` : ""}</div></article>`;
    }).join("") || '<p class="empty-state">No memories here yet. Be the first to share one!</p>';
    setupScrollReveal();
  }

  function renderVotes() {
    const ranked = menu.map(item => ({ ...item, count: data.votes.filter(vote => vote.item === item.id).length })).sort((a, b) => b.count - a.count);
    const grid = $("#vote-grid");
    unobserveScrollReveal(grid);
    grid.innerHTML = ranked.map(item => `<article class="vote-card${item.image ? " has-image" : ""}">${item.image ? `<div class="vote-card-media"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || `${item.name} dish`)}" loading="lazy"></div>` : ""}<div class="vote-card-content"><div class="vote-title-line"><h3>${escapeHtml(item.name)}</h3><span class="vote-leader" aria-hidden="true"></span><span class="vote-count">${item.count} ${item.count === 1 ? "vote" : "votes"}</span></div><p>${escapeHtml(item.description || item.imageAlt || `A favourite for the reunion feast.`)}</p><button type="button" data-vote="${item.id}">See votes &amp; vote <span>↗</span></button></div></article>`).join("");
    setupScrollReveal();
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

  function openWhatsApp(message, recipient) {
    const number = String(recipient === undefined ? config.whatsapp : recipient || "").replace(/\D/g, "");
    if (!number) {
      notify("The organiser hasn't added a WhatsApp number yet. Please check back soon.");
      return false;
    }
    const defaultMessage = "Hi! I have a memory to share with the school reunion. I'll attach my photos, videos or documents here.";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message || defaultMessage)}`, "_blank", "noopener,noreferrer");
    return true;
  }

  function attachGroupRequestForm() {
    const form = $("#group-request-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = form.elements.name.value.trim();
      const phone = form.elements.phone.value.trim();
      const message = `Hi! Please add me to the school reunion WhatsApp group.\nName: ${name}\nPhone: ${phone}`;
      const status = $(".form-status", form);
      if (!openWhatsApp(message)) {
        status.textContent = "WhatsApp is unavailable. Please contact the organiser another way.";
        return;
      }
      status.textContent = "WhatsApp is ready with your request. Send the message there; an organiser will add you to the group.";
    });
  }

  function attachFeastRsvpForm() {
    const form = $("#feast-rsvp-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = form.elements.name.value.trim();
      const attendance = form.elements.attendance.value;
      const feedback = form.elements.feedback.value.trim();
      const message = `Feast RSVP\nName: ${name}\nAttendance: ${attendance}${feedback ? `\nFeedback: ${feedback}` : ""}`;
      const status = $(".form-status", form);
      if (!openWhatsApp(message, config.whatsappFeast)) {
        status.textContent = "WhatsApp is unavailable. Please contact the organiser another way.";
        return;
      }
      status.textContent = "WhatsApp is ready with your RSVP. Send the message there to share your response.";
    });
  }

  function setupFeastPhotoCarousel() {
    const main = $(".feast-rsvp-main");
    const thumbnails = $$(".feast-rsvp-thumbnail");
    if (!main || thumbnails.length === 0) return;

    const photos = [
      { src: main.getAttribute("src"), alt: main.alt },
      ...thumbnails.map(button => ({ src: $("img", button).getAttribute("src"), alt: button.dataset.photoAlt }))
    ];
    let activePhoto = 0;
    let changeTimer;
    const showPhoto = index => {
      activePhoto = (index + photos.length) % photos.length;
      clearTimeout(changeTimer);
      main.classList.add("is-changing");
      changeTimer = setTimeout(() => {
        main.src = photos[activePhoto].src;
        main.alt = photos[activePhoto].alt;
        thumbnails.forEach((button, position) => {
          const photoIndex = (activePhoto + position + 1) % photos.length;
          button.dataset.photoIndex = String(photoIndex);
          button.dataset.photoAlt = photos[photoIndex].alt;
          button.setAttribute("aria-label", `Show reunion photo ${photoIndex + 1} of ${photos.length}`);
          $("img", button).src = photos[photoIndex].src;
        });
        window.requestAnimationFrame(() => main.classList.remove("is-changing"));
      }, 180);
    };

    thumbnails.forEach(button => button.addEventListener("click", () => showPhoto(Number(button.dataset.photoIndex))));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(() => showPhoto(activePhoto + 1), 3000);
    }
  }

  function showSlide(index) {
    selectedSlide = index;
    $$(".hero-slide").forEach((slide, i) => { slide.classList.toggle("is-active", i === index); slide.setAttribute("aria-hidden", String(i !== index)); });
    $$(".slide-dot").forEach((dot, i) => { dot.classList.toggle("active", i === index); dot.setAttribute("aria-pressed", String(i === index)); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-setting]").forEach(element => { element.textContent = config[element.dataset.setting] || element.textContent; });
    $("#year").textContent = new Date().getFullYear();
    setupScrollReveal();
    const scrollPage = top => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.scrollTo({ top, behavior });
    };
    const scrollToggle = $("#scroll-toggle");
    let scrollDestination = "bottom";
    const updateScrollToggle = () => {
      const midpoint = (document.documentElement.scrollHeight - window.innerHeight) / 2;
      scrollDestination = window.scrollY < midpoint ? "bottom" : "top";
      if (scrollToggle.dataset.destination === scrollDestination) return;
      scrollToggle.dataset.destination = scrollDestination;
      scrollToggle.textContent = scrollDestination === "bottom" ? "↓" : "↑";
      scrollToggle.setAttribute("aria-label", `Go to ${scrollDestination}`);
      scrollToggle.title = `Go to ${scrollDestination}`;
    };
    scrollToggle.addEventListener("click", () => {
      scrollPage(scrollDestination === "bottom" ? document.documentElement.scrollHeight : 0);
    });
    window.addEventListener("scroll", updateScrollToggle, { passive: true });
    window.addEventListener("resize", updateScrollToggle);
    updateScrollToggle();
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
    $("#whatsapp-button").addEventListener("click", () => openWhatsApp());
    $(".footer-whatsapp").addEventListener("click", () => openWhatsApp());
    attachGroupRequestForm();
    attachFeastRsvpForm();
    setupFeastPhotoCarousel();
    attachForm("#story-form", "story");
    attachForm("#vote-form", "vote");
    attachPreferenceForm();
    if (demo) $(".vote-foot").textContent = "Demo only: votes are saved in this browser and are not shared.";
    
    loadData().catch(error => {
      $("#friends-table").innerHTML = '<tr><td colspan="3">Could not load the friends list.</td></tr>';
      $("#memories-grid").innerHTML = '<p class="empty-state">Could not load memories.</p>';
      $("#vote-grid").innerHTML = '<p class="empty-state">Could not load voting results.</p>';
      $("#food-preference-note").textContent = "Could not load food preference counts. Please refresh the page.";
      setupScrollReveal();
      notify(`Could not load reunion data: ${error.message}`);
    });
  });
})();
