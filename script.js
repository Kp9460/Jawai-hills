// JAWAI SAFARI — MODERN OPTIMIZED SCRIPT

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const on = (el, event, fn, options) =>
  el?.addEventListener(event, fn, options);

// ---------- MENU ----------

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

on(menuBtn, "click", () => navLinks.classList.toggle("open"));
on(navLinks, "click", (e) => {
  if (e.target.closest("a")) navLinks.classList.remove("open");
});


// SCROLL

const progress = $("#progress");
const leo = $("#leoTraveller");
const speeds = $$("[data-speed]");

let scrollTick = false;

const updateScroll = () => {
  const y = scrollY;
  const vh = innerHeight;
  const max = Math.max(document.documentElement.scrollHeight - vh, 1);
  const p = Math.min(y / max, 1);

  progress && (progress.style.width = `${p * 100}%`);

  if (leo) {
    const x = -240 + p * (innerWidth + 480);
    const ly = Math.sin(y / 120) * 14;

    leo.style.transform = `translate3d(${x}px,${ly}px,0)`;
    leo.style.opacity = y > 200 && y < max - 300 ? ".55" : "0";
  }

  speeds.forEach((el) => {
    const r = el.getBoundingClientRect();
    const speed = +el.dataset.speed || 0;
    const offset = (r.top + r.height / 2 - vh / 2) * speed;

    el.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
  });

  scrollTick = false;
};

on(
  window,
  "scroll",
  () => {
    if (!scrollTick) {
      requestAnimationFrame(updateScroll);
      scrollTick = true;
    }
  },
  { passive: true }
);

updateScroll();


// REVEAL

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;

      target.classList.add("in");
      observer.unobserve(target);
    });
  },
  { threshold: 0.12 }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));


// MAP ZONES

const zones = {
  bera: {
    k: "ZONE 01 — BERA CAVES",
    t: "Bera Caves",
    d: "Highest density. Leopards den in the boulders behind the village. First light = best odds. Sunrise breakfast rock is here.",
    time: "⏱ 5:30 AM start",
    odds: "●●●●○ sighting"
  },
  kala: {
    k: "ZONE 02 — KALA PAHAR",
    t: "Kala Pahar",
    d: "Black-rock ridge, golden-hour backlight. Hyena + leopard double-headers at sunset. Photographer favourite.",
    time: "⏱ 3:30 PM start",
    odds: "●●●○○ sighting"
  },
  devgiri: {
    k: "ZONE 03 — DEVGIRI",
    t: "Devgiri Trail",
    d: "Quiet valley trail, fewer gypsies. Cubs + mothers in winter. Slow tracking, big payoff.",
    time: "⏱ 6:00 AM start",
    odds: "●●●○○ sighting"
  },
  dam: {
    k: "ZONE 04 — JAWAI DAM",
    t: "Jawai Dam",
    d: "Crocodiles, flamingos, pelicans. Every safari ends here — mist, chai, eagles overhead.",
    time: "⏱ 8:00 AM circuit",
    odds: "●●●●● birds"
  }
};

const zoneEls = [
  $("#zoneKicker"),
  $("#zoneTitle"),
  $("#zoneDesc"),
  $("#zoneTime"),
  $("#zoneOdds")
];

const pins = $$(".pin");

const selectZone = (pin) => {
  const zone = zones[pin.dataset.zone];
  if (!zone) return;

  pins.forEach((p) =>
    p.classList.toggle("active", p === pin)
  );

  zoneEls[0].textContent = zone.k;
  zoneEls[1].textContent = zone.t;
  zoneEls[2].textContent = zone.d;
  zoneEls[3].textContent = zone.time;
  zoneEls[4].textContent = zone.odds;
};

pins.forEach((pin) => on(pin, "click", () => selectZone(pin)));
pins[0] && selectZone(pins[0]);


// SAFARI

const PRICES = Object.freeze({
  sunrise: 4000,
  sunset: 4000,
  fullday: 11500
});

const NAMES = Object.freeze({
  sunrise: "Sunrise Stalk",
  sunset: "Sunset Shadow",
  fullday: "The Full Journal"
});

let track = "sunrise";
let guests = 2;
let gypsies = 1;

const trackButtons = $$("#trackSeg button");
const safariCards = $$(".adv-card");
const pickButtons = $$(".pick-btn");

const guestCount = $("#gCount");
const gypsyCount = $("#jCount");

const bill = {
  track: $("#billTrack"),
  base: $("#billBase"),
  extra: $("#billExtra"),
  total: $("#billTotal"),
  seats: $("#seatNote")
};

const calculatePrice = () => {
  const base = PRICES[track] * gypsies;
  const free = gypsies * 2;
  const extraGuests = Math.max(0, guests - free);
  const extra = extraGuests * (track === "fullday" ? 1200 : 600);
  const total = base + extra;

  bill.track.textContent = `${NAMES[track]} × ${gypsies} gypsy`;
  bill.base.textContent = `₹${base.toLocaleString("en-IN")}`;
  bill.extra.textContent = `₹${extra.toLocaleString("en-IN")}`;
  bill.total.textContent = `₹${total.toLocaleString("en-IN")}`;
  bill.seats.textContent =
    guests > gypsies * 6
      ? "max 6/gypsy — add gypsy"
      : `${gypsies * 6 - guests} seats free`;

  return total;
};

const setTrack = (type) => {
  if (!PRICES[type]) return;

  track = type;

  trackButtons.forEach((btn) =>
    btn.classList.toggle("on", btn.dataset.track === type)
  );

  safariCards.forEach((card) =>
    card.classList.toggle("selected", card.dataset.safari === type)
  );

  pickButtons.forEach((btn) => {
    const selected = btn.dataset.pick === type;
    btn.classList.toggle("on", selected);
    btn.textContent = selected ? "✓ Selected" : "Select →";
  });

  calculatePrice();
};

trackButtons.forEach((btn) =>
  on(btn, "click", () => setTrack(btn.dataset.track))
);

pickButtons.forEach((btn) =>
  on(btn, "click", () => {
    setTrack(btn.dataset.pick);
    $("#permit")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  })
);


// COUNTERS

const updateCounters = () => {
  guestCount.textContent = guests;
  gypsyCount.textContent = gypsies;
  calculatePrice();
};

on($("#gPlus"), "click", () => {
  guests = Math.min(24, guests + 1);

  if (guests > gypsies * 6)
    gypsies = Math.min(4, Math.ceil(guests / 6));

  updateCounters();
});

on($("#gMinus"), "click", () => {
  guests = Math.max(1, guests - 1);
  updateCounters();
});

on($("#jPlus"), "click", () => {
  gypsies = Math.min(4, gypsies + 1);
  updateCounters();
});

on($("#jMinus"), "click", () => {
  gypsies = Math.max(1, gypsies - 1);

  if (guests > gypsies * 6)
    guests = gypsies * 6;

  updateCounters();
});


// CALENDAR

let calendarView = new Date();
calendarView.setDate(1);

let selectedDate = null;

const calendarTitle = $("#calTitle");
const calendarGrid = $("#calGrid");
const selectedDateLabel = $("#selDateLabel");

const getAvailability = (year, month, day) => {
  const seed = (year * 372 + month * 31 + day * 7) % 10;
  return seed < 5 ? "ok" : seed < 8 ? "few" : "full";
};

const selectDate = (date, status) => {
  selectedDate = date;

  selectedDateLabel.textContent =
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + (status === "few" ? " — only 2 gypsies left!" : "");

  renderCalendar();
};

function renderCalendar() {
  if (!calendarTitle || !calendarGrid) return;

  const year = calendarView.getFullYear();
  const month = calendarView.getMonth();

  calendarTitle.textContent = calendarView.toLocaleString("en", {
    month: "long",
    year: "numeric"
  });

  calendarGrid.replaceChildren();

  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("button");
    blank.className = "blank";
    blank.disabled = true;
    calendarGrid.appendChild(blank);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day);
    const status = getAvailability(year, month, day);
    const button = document.createElement("button");

    const unavailable = date < today || status === "full";

    button.textContent = day;
    button.className = status;
    button.disabled = unavailable;

    if (unavailable) button.classList.add("full");

    if (selectedDate?.getTime() === date.getTime())
      button.classList.add("sel");

    if (!unavailable)
      on(button, "click", () => selectDate(date, status));

    calendarGrid.appendChild(button);
  }
}

on($("#calPrev"), "click", () => {
  calendarView.setMonth(calendarView.getMonth() - 1);
  renderCalendar();
});

on($("#calNext"), "click", () => {
  calendarView.setMonth(calendarView.getMonth() + 1);
  renderCalendar();
});


// FACTS

const flipCards = $$(".flip");
const collectCount = $("#collectCount");

flipCards.forEach((card) =>
  on(card, "click", () => {
    card.classList.toggle("done");

    collectCount.textContent =
      `${$$(".flip.done").length}/${flipCards.length}`;
  })
);


// HORIZONTAL GALLERY

const horizontalScroll = $("#hScroll");

if (horizontalScroll) {
  let startX = 0;
  let startScroll = 0;

  on(horizontalScroll, "pointerdown", (e) => {
    startX = e.clientX;
    startScroll = horizontalScroll.scrollLeft;
    horizontalScroll.setPointerCapture(e.pointerId);
  });

  on(horizontalScroll, "pointermove", (e) => {
    if (!horizontalScroll.hasPointerCapture(e.pointerId)) return;

    horizontalScroll.scrollLeft =
      startScroll - (e.clientX - startX);
  });

  on(horizontalScroll, "pointerup", (e) => {
    horizontalScroll.releasePointerCapture(e.pointerId);
  });

  on(horizontalScroll, "pointercancel", (e) => {
    horizontalScroll.releasePointerCapture(e.pointerId);
  });
}


// PERMIT + WHATSAPP

const permitNumber = $("#permitNo");
const stampButton = $("#stampBtn");

if (permitNumber)
  permitNumber.textContent =
    `JW-${Math.floor(1000 + Math.random() * 9000)}`;

on(stampButton, "click", () => {
  const name = $("#pName")?.value.trim();
  const phone = $("#pPhone")?.value.trim();

  if (!selectedDate)
    return alert("Pehle calendar me ek green date select karo 📅");

  if (!name || !phone)
    return alert("Naam + phone likho taaki permit par stamp lage ✍️");

  const total = calculatePrice();

  $("#permitCard")?.classList.add("stamped");

  const message = encodeURIComponent(`
JAWAI SAFARI PERMIT ${permitNumber.textContent}
Name: ${name}
Phone: ${phone}
Track: ${NAMES[track]}
Date: ${selectedDate.toLocaleDateString("en-IN")}
Guests: ${guests} (${gypsies} gypsy)
Total: Rs.${total}
Please confirm my permit.
`);

  setTimeout(
    () =>
      window.open(
        `https://wa.me/919829000000?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      ),
    600
  );
});


// MAGNETIC BUTTON

const enterButton = $("#enterBtn");

on(enterButton, "mousemove", (e) => {
  const r = enterButton.getBoundingClientRect();

  const x = (e.clientX - r.left - r.width / 2) / 8;
  const y = (e.clientY - r.top - r.height / 2) / 8;

  enterButton.style.transform =
    `translate3d(${x}px,${y}px,0)`;
});

on(enterButton, "mouseleave", () => {
  enterButton.style.transform = "";
});


// INIT

if (matchMedia("(prefers-reduced-motion: reduce)").matches)
  document.documentElement.classList.add("reduce-motion");

setTrack("sunrise");
renderCalendar();