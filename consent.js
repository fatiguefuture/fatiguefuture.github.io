(() => {
  const STORAGE_KEY = "ff-embed-consent";

  const remembered = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const remember = (provider) => {
    const next = remembered();
    next[provider] = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota / private mode
    }
  };

  const withAutoplay = (src) => {
    try {
      const url = new URL(src, window.location.href);
      url.searchParams.set("autoplay", "1");
      return url.toString();
    } catch {
      return src.includes("?") ? `${src}&autoplay=1` : `${src}?autoplay=1`;
    }
  };

  const activate = (facade, { autoplay = false } = {}) => {
    const provider = facade.dataset.provider;
    const rawSrc = facade.dataset.src;
    const src =
      autoplay && provider === "youtube" ? withAutoplay(rawSrc) : rawSrc;
    const title = facade.dataset.title || "External player";
    const allow = facade.dataset.allow || "";
    const height = facade.dataset.height;

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "");
    if (allow) iframe.setAttribute("allow", allow);
    if (height) {
      iframe.style.border = "0";
      iframe.style.width = "100%";
      iframe.style.height = height;
    }

    facade.replaceWith(iframe);
    iframe.focus();
    if (provider) remember(provider);
  };

  const setup = (facade) => {
    const provider = facade.dataset.provider;
    const loadBtn = facade.querySelector("[data-load]");

    if (provider && remembered()[provider]) {
      // Restore embed quietly, no autoplay on refresh
      activate(facade, { autoplay: false });
      return;
    }

    loadBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      activate(facade, { autoplay: true });
    });
  };

  document.querySelectorAll("[data-facade]").forEach(setup);
})();
