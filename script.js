const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const siteHeader = document.querySelector(".site-header");
const floatingCta = document.querySelector(".floating-cta");
const contactSection = document.querySelector("#contact");

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
