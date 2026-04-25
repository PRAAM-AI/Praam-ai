const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const siteHeader = document.querySelector(".topbar");
const floatingCta = document.querySelector(".floating-cta");
const contactSection = document.querySelector("#contact");

/** In-page target for #section (used for hash URL + same-hash link clicks). */
function hashTargetElement(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.querySelector(hash);
  } catch {
    return null;
  }
}

function scrollToHash(hash, behavior = "smooth") {
  const el = hashTargetElement(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

/** Solutions carousel + PRISM deep-dive panel (only visible on PRISM slide). Runs before hash scroll. */
(() => {
  const prismPanel = document.getElementById("prism");
  const PRISM_SLIDE_INDEX = 1;

  const root = document.getElementById("solutions-carousel");
  const track = document.getElementById("solutions-carousel-track");
  const status = document.getElementById("solutions-carousel-status");
  const viewport = root?.querySelector(".case-carousel-viewport");
  const prevBtn = root?.querySelector("[data-solutions-carousel-prev]");
  const nextBtn = root?.querySelector("[data-solutions-carousel-next]");

  if (!root || !track || !viewport) return;

  const slides = Array.from(track.querySelectorAll(".solutions-carousel-slide"));
  const count = slides.length;
  if (count === 0) return;

  let index = 0;
  const slideFraction = 100 / count;

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeTracking = false;

  function applyTransform() {
    track.style.transform = `translate3d(-${slideFraction * index}%, 0, 0)`;
  }

  function announce() {
    if (!status) return;
    const title = slides[index]?.querySelector("h3")?.textContent?.trim() || "";
    status.textContent = `Solution ${index + 1} of ${count}: ${title}`;
  }

  function syncPrismPanel() {
    if (!prismPanel) return;
    if (index === PRISM_SLIDE_INDEX) {
      prismPanel.removeAttribute("hidden");
    } else {
      const flowDialog = document.getElementById("prism-flow-dialog");
      if (flowDialog?.open) flowDialog.close();
      prismPanel.setAttribute("hidden", "");
    }
  }

  function goTo(i) {
    index = ((i % count) + count) % count;
    applyTransform();
    announce();
    syncPrismPanel();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeTracking = true;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    try {
      viewport.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  });

  viewport.addEventListener("pointerup", (event) => {
    if (!swipeTracking) return;
    swipeTracking = false;
    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    const dx = event.clientX - swipeStartX;
    const dy = event.clientY - swipeStartY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      goTo(index + 1);
    } else {
      goTo(index - 1);
    }
  });

  viewport.addEventListener("pointercancel", () => {
    swipeTracking = false;
  });

  function syncSolutionsFromHash() {
    const h = window.location.hash;
    if (h === "#how-it-works") goTo(0);
    else if (h === "#prism") goTo(1);
  }

  window.addEventListener("hashchange", syncSolutionsFromHash, true);

  const initial = window.location.hash;
  if (initial === "#how-it-works") {
    goTo(0);
  } else if (initial === "#prism") {
    goTo(1);
  } else {
    applyTransform();
    announce();
    syncPrismPanel();
  }
})();

/** Solutions “How it works” + case-study depth: popups on narrow viewports (see styles). */
(() => {
  const solDialog = document.getElementById("solution-how-dialog");
  const solBody = document.getElementById("solution-how-dialog-body");
  const solTitle = document.getElementById("solution-how-dialog-title");
  if (solDialog && solBody && solTitle && typeof solDialog.showModal === "function") {
    const closeSol = () => {
      try {
        solDialog.close();
      } catch {
        /* noop */
      }
    };

    document.querySelectorAll("[data-solution-how-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slide = btn.closest(".solutions-carousel-slide");
        const source = slide?.querySelector(".solutions-merge-how");
        if (!source) return;
        const t = source.querySelector(".how-inline-title")?.textContent?.trim();
        solTitle.textContent = t || "How it works";
        solBody.replaceChildren();
        const clone = source.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        solBody.appendChild(clone);
        try {
          solDialog.showModal();
        } catch {
          /* noop */
        }
      });
    });

    solDialog.querySelectorAll("[data-detail-dialog-close]").forEach((b) => b.addEventListener("click", closeSol));
    solDialog.addEventListener("click", (event) => {
      if (event.target === solDialog) closeSol();
    });
  }

  const caseDialog = document.getElementById("case-detail-dialog");
  const caseBody = document.getElementById("case-detail-dialog-body");
  const caseTitle = document.getElementById("case-detail-dialog-title");
  if (caseDialog && caseBody && caseTitle && typeof caseDialog.showModal === "function") {
    const closeCase = () => {
      try {
        caseDialog.close();
      } catch {
        /* noop */
      }
    };

    document.querySelectorAll("[data-case-detail-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-case-detail-open");
        const source = id ? document.getElementById(id) : null;
        if (!source) return;
        const card = btn.closest(".case-card");
        const heading = card?.querySelector(".case-body h3");
        caseTitle.textContent = heading?.textContent?.trim() || "Case study";
        caseBody.replaceChildren();
        const clone = source.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        caseBody.appendChild(clone);
        try {
          caseDialog.showModal();
        } catch {
          /* noop */
        }
      });
    });

    caseDialog.querySelectorAll("[data-case-detail-dialog-close]").forEach((b) => b.addEventListener("click", closeCase));
    caseDialog.addEventListener("click", (event) => {
      if (event.target === caseDialog) closeCase();
    });
  }
})();

/** Opening e.g. /#home or reflow after min-heights: browser scroll can run too early. */
function applyHashFromLocation() {
  const { hash } = window.location;
  if (!hash) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToHash(hash, "auto");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyHashFromLocation);
} else {
  applyHashFromLocation();
}

window.addEventListener("load", () => {
  if (window.location.hash) {
    scrollToHash(window.location.hash, "auto");
  }
});

window.addEventListener("hashchange", () => {
  scrollToHash(window.location.hash, "smooth");
});

/* If URL already ends with #home (etc.), clicking Home does nothing unless we handle it. */
document.addEventListener(
  "click",
  (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const raw = anchor.getAttribute("href");
    if (!raw || !raw.startsWith("#") || raw === "#") return;
    let linkUrl;
    try {
      linkUrl = new URL(anchor.href);
    } catch {
      return;
    }
    if (linkUrl.origin !== window.location.origin) return;
    if (linkUrl.pathname !== window.location.pathname || linkUrl.search !== window.location.search) return;
    if (linkUrl.hash !== window.location.hash) return;
    const el = hashTargetElement(raw);
    if (!el) return;
    event.preventDefault();
    scrollToHash(raw, "smooth");
  },
  true
);

const updateActiveNav = () => {
  const y = window.scrollY + 180;
  let currentId = "";

  for (const section of sections) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (y >= top) {
      currentId = section.id;
    }
  }

  if (!currentId && sections.length > 0) {
    currentId = sections[0].id;
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
};

const updateChromeState = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);

  if (!floatingCta) {
    return;
  }

  const hasScrolledEnough = window.scrollY > window.innerHeight * 0.65;
  let nearContact = false;

  if (contactSection) {
    const rect = contactSection.getBoundingClientRect();
    nearContact = rect.top < window.innerHeight - 120;
  }

  floatingCta.classList.toggle("is-visible", hasScrolledEnough && !nearContact);
  floatingCta.classList.toggle("is-hidden", nearContact);
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);
window.addEventListener("scroll", updateChromeState, { passive: true });
window.addEventListener("load", updateChromeState);
window.addEventListener("resize", updateChromeState);

document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const originalText = button.textContent;

  button.textContent = "Message Received";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2200);
});

/** Case studies: horizontal carousel (prev / next, swipe, circular; sync #knowledge-studio). */
(() => {
  const root = document.getElementById("case-carousel");
  const track = document.getElementById("case-carousel-track");
  const status = document.getElementById("case-carousel-status");
  const viewport = root?.querySelector(".case-carousel-viewport");
  const prevBtn = root?.querySelector("[data-carousel-prev]");
  const nextBtn = root?.querySelector("[data-carousel-next]");

  if (!root || !track || !viewport) return;

  const slides = Array.from(track.querySelectorAll(".case-card"));
  const count = slides.length;
  if (count === 0) return;

  const knowledgeIndex = Math.max(0, slides.findIndex((el) => el.id === "knowledge-studio"));
  let index = 0;
  const slideFraction = 100 / count;

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeTracking = false;

  function applyTransform() {
    track.style.transform = `translate3d(-${slideFraction * index}%, 0, 0)`;
  }

  function announce() {
    if (!status) return;
    const title = slides[index]?.querySelector("h3")?.textContent?.trim() || "";
    status.textContent = `Case study ${index + 1} of ${count}: ${title}`;
  }

  function goTo(i) {
    index = ((i % count) + count) % count;
    applyTransform();
    announce();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  function syncFromHash() {
    if (window.location.hash === "#knowledge-studio") {
      goTo(knowledgeIndex);
    }
  }

  window.addEventListener("hashchange", syncFromHash);

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipeTracking = true;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    try {
      viewport.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  });

  viewport.addEventListener("pointerup", (event) => {
    if (!swipeTracking) return;
    swipeTracking = false;
    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    const dx = event.clientX - swipeStartX;
    const dy = event.clientY - swipeStartY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      goTo(index + 1);
    } else {
      goTo(index - 1);
    }
  });

  viewport.addEventListener("pointercancel", () => {
    swipeTracking = false;
  });

  if (window.location.hash === "#knowledge-studio") {
    goTo(knowledgeIndex);
  } else {
    applyTransform();
    announce();
  }
})();

/** PRISM section: native dialog popup for end-to-end flow overview. */
(() => {
  const dialog = document.getElementById("prism-flow-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const openers = document.querySelectorAll("[data-prism-dialog-open]");
  const closers = dialog.querySelectorAll("[data-prism-dialog-close]");

  function openDialog() {
    try {
      dialog.showModal();
    } catch {
      /* already open */
    }
  }

  function closeDialog() {
    dialog.close();
  }

  openers.forEach((btn) => btn.addEventListener("click", openDialog));
  closers.forEach((btn) => btn.addEventListener("click", closeDialog));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
})();

/** v2 timeline: click steps to mark progress (lines turn blue). */
(() => {
  const timelines = Array.from(document.querySelectorAll(".v2-timeline"));
  if (timelines.length === 0) return;

  function setActive(items, activeIndex) {
    items.forEach((item, idx) => {
      item.classList.toggle("is-active", idx === activeIndex);
      item.classList.toggle("is-complete", idx < activeIndex);
    });
  }

  timelines.forEach((timeline) => {
    const items = Array.from(timeline.querySelectorAll(".v2-timeline-item"));
    if (items.length === 0) return;

    const initialIndex = Math.max(
      0,
      items.findIndex((el) => el.classList.contains("is-active"))
    );
    setActive(items, initialIndex === -1 ? 0 : initialIndex);

    items.forEach((item, idx) => {
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-pressed", item.classList.contains("is-active") ? "true" : "false");

      const activate = () => {
        setActive(items, idx);
        items.forEach((el) => el.setAttribute("aria-pressed", el.classList.contains("is-active") ? "true" : "false"));
      };

      item.addEventListener("click", activate);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });
  });
})();

