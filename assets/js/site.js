// Loaded in <head> so the saved theme applies before the first paint.
(function () {
  var root = document.documentElement;

  function storedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = storedTheme() || (systemDark ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".theme-toggle").addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    // Play clips only while on screen, so a page of videos doesn't download them all at once.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.play().catch(function () {});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("video").forEach(function (video) {
      observer.observe(video);
    });
  });
})();
