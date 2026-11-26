/* =====================================================
   TST15 — Main JavaScript
   Language Switcher (EN / TH)
   Mobile Navigation
   Active Navigation on Scroll
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  const languageButtons = document.querySelectorAll("[data-lang]");
  const translatableElements = document.querySelectorAll(
    "[data-en][data-th]"
  );

  /* =====================================================
     1. LANGUAGE SWITCHER
     ===================================================== */

  const descriptions = {
    en: "The 15th Conference on Taxonomy and Systematics in Thailand (TST15), 12–14 May 2027, Chulalongkorn University, Bangkok, Thailand.",

    th: "การประชุมวิชาการอนุกรมวิธานและซิสเทมาติคส์ในประเทศไทย ครั้งที่ 15 วันที่ 12–14 พฤษภาคม 2570 ณ จุฬาลงกรณ์มหาวิทยาลัย กรุงเทพมหานคร"
  };

  function setLanguage(language) {

    const lang = language === "th" ? "th" : "en";

    // Update document language
    document.documentElement.lang = lang;

    // Translate all elements
    // innerHTML allows <br>, <em>, and other inline HTML
    translatableElements.forEach((element) => {

      const translation = element.getAttribute(`data-${lang}`);

      if (translation !== null) {
        element.innerHTML = translation;
      }

    });

    // Update language button appearance
    languageButtons.forEach((button) => {

      const active = button.getAttribute("data-lang") === lang;

      button.classList.toggle("active", active);

      button.setAttribute("aria-pressed", String(active));

    });

    // Update SEO descriptions
    const metaSelectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]'
    ];

    metaSelectors.forEach((selector) => {

      const meta = document.querySelector(selector);

      if (meta) {
        meta.setAttribute("content", descriptions[lang]);
      }

    });

    // Remember selected language
    try {
      localStorage.setItem("tst15-language", lang);
    } catch (error) {
      // Continue without localStorage if unavailable
    }

  }

  // Connect language buttons
  languageButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const lang = button.getAttribute("data-lang");

      setLanguage(lang);

    });

  });

  // Restore saved language
  let initialLanguage = "en";

  try {
    initialLanguage = localStorage.getItem("tst15-language") || "en";
  } catch (error) {
    initialLanguage = "en";
  }

  setLanguage(initialLanguage);


  /* =====================================================
     2. MOBILE NAVIGATION
     ===================================================== */

  function closeMenu() {

    if (!menuButton || !nav) return;

    nav.classList.remove("open");

    menuButton.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.setAttribute("aria-label", "Open navigation");

  }

  if (menuButton && nav) {

    // Toggle mobile menu
    menuButton.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("open");

      menuButton.classList.toggle("open", isOpen);

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

    });

    // Close menu after clicking a navigation link
    nav.querySelectorAll('a[href^="#"]').forEach((link) => {

      link.addEventListener("click", closeMenu);

    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {

      const clickedInsideNav = nav.contains(event.target);

      const clickedMenuButton = menuButton.contains(event.target);

      if (!clickedInsideNav && !clickedMenuButton) {
        closeMenu();
      }

    });

    // Close menu with Escape key
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Close menu when switching to desktop
    window.addEventListener("resize", () => {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    });

  }


  /* =====================================================
     3. ACTIVE NAVIGATION ON SCROLL
     ===================================================== */

  if (nav && "IntersectionObserver" in window) {

    const sections = document.querySelectorAll(
      "main section[id]"
    );

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          nav.querySelectorAll('a[href^="#"]').forEach((link) => {

            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);

          });

        });

      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {

      observer.observe(section);

    });

  }

});
