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
  const offset = window.scrollY + 180;
  let currentId = "";

  for (const section of sections) {
    if (offset >= section.offsetTop) {
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

