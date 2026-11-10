(() => {
  const INSTAGRAM_URL = "https://instagram.com/fatigue.future/";
  const root = document.querySelector("[data-gigs]");
  if (!root) {
    return;
  }

  const berlinToday = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });

  const formatDisplayDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
  };

  const upcoming = (gigs) => {
    const today = berlinToday();
    return gigs.filter((gig) => gig.date >= today);
  };

  const renderEmpty = () => {
    root.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "gigs__empty";
    empty.append("Keine kommenden Termine hier. Aktuelles auf ");
    const link = document.createElement("a");
    link.href = INSTAGRAM_URL;
    link.rel = "noopener noreferrer";
    link.textContent = "Instagram";
    empty.append(link);
    empty.append(".");
    root.append(empty);
  };

  const renderList = (gigs) => {
    root.replaceChildren();
    const list = document.createElement("ol");
    list.className = "gigs__list";

    for (const gig of gigs) {
      const item = document.createElement("li");
      item.className = "gigs__item";

      const time = document.createElement("time");
      time.dateTime = gig.date;
      time.textContent = formatDisplayDate(gig.date);

      const label = document.createElement("span");
      label.className = "gigs__label";

      if (gig.url) {
        const link = document.createElement("a");
        link.href = gig.url;
        link.rel = "noopener noreferrer";
        link.textContent = gig.label;
        label.append(link);
      } else {
        label.textContent = gig.label;
      }

      item.append(time, " ", label);
      list.append(item);
    }

    root.append(list);
  };

  fetch("gigs.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((payload) => {
      const gigs = Array.isArray(payload?.gigs) ? upcoming(payload.gigs) : [];
      if (gigs.length === 0) {
        renderEmpty();
        return;
      }
      renderList(gigs);
    })
    .catch(() => {
      renderEmpty();
    });
})();
