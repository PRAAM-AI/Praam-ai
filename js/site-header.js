(() => {
  const header = document.querySelector("header");
  if (!header) return;

  const homeHero = document.querySelector("section.hero");
  const pageIntro = document.querySelector(".page-intro");
  const contactHero = document.querySelector(".contact-mono .mono-hero");
  const band = homeHero || pageIntro || contactHero;

  const update = () => {
    const y = window.scrollY || 0;

    if (band) {
      const threshold = Math.max(120, band.offsetHeight * 0.55);
      const past = y > threshold;
      header.classList.toggle("is-light", past);
      header.classList.toggle("is-solid", past);
      return;
    }

    header.classList.toggle("is-light", y > 40);
    header.classList.toggle("is-solid", y > 40);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
