(() => {
  const header = document.querySelector("header");
  if (!header) return;

  const darkHero = document.querySelector(".page-hero");
  const lightSurface =
    document.querySelector(".hero") || document.body.classList.contains("contact-mono");

  const update = () => {
    const y = window.scrollY || 0;

    if (lightSurface) {
      // Light hero / contact: dark text always; solid white after a short scroll
      header.classList.add("is-light");
      header.classList.toggle("is-solid", y > 20);
      return;
    }

    if (darkHero) {
      // Dark subpage hero: white text over hero, white bar + dark text after
      const threshold = Math.max(120, darkHero.offsetHeight * 0.55);
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
