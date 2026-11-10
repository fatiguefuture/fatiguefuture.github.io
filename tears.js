(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.querySelector(".tears");
  if (!root || reduced) {
    if (root) root.hidden = true;
    return;
  }

  const rand = (min, max) => min + Math.random() * (max - min);

  const tears = [...root.querySelectorAll(".tear")];
  const left = tears.filter((el) => el.classList.contains("tear--left"));
  const right = tears.filter((el) => el.classList.contains("tear--right"));

  const placeX = (el, side) => {
    const maxVw = window.innerWidth < 768 ? 5.5 : 8.5;
    const x = rand(0.2, maxVw);
    if (side === "left") {
      el.style.left = `${x}vw`;
      el.style.right = "auto";
    } else {
      el.style.right = `${x}vw`;
      el.style.left = "auto";
    }
  };

  const rollSpeed = (prev) => {
    let speed = rand(7, 36);
    let n = 0;
    while (prev != null && Math.abs(speed - prev) < 6 && n < 10) {
      speed = rand(7, 36);
      n += 1;
    }
    return speed;
  };

  const initY = (index, total, phase) => {
    const step = 140 / total;
    return -25 + phase + index * step + rand(-5, 5);
  };

  const make = (el, side, index, total, phase) => {
    el.style.animation = "none";
    el.style.top = "0";
    placeX(el, side);
    el.style.width = `${rand(1.15, 2.2)}rem`;

    return {
      el,
      side,
      y: initY(index, total, phase),
      speed: rollSpeed(null),
      swayAmp: rand(0.2, 1.05),
      swayFreq: rand(0.1, 0.6),
      rotAmp: rand(3, 10),
      phase: rand(0, Math.PI * 2),
      nextSpeedAt: performance.now() + rand(2000, 8000),
      waitUntil: 0,
      flip: Math.random() < 0.45 ? -1 : 1,
      baseOpacity: rand(0.45, 0.88),
    };
  };

  // Right side starts half a slot later → no left/right “windows”
  const state = [
    ...left.map((el, i) => make(el, "left", i, left.length, 0)),
    ...right.map((el, i) =>
      make(el, "right", i, right.length, 140 / right.length / 2)
    ),
  ];

  // Shuffle speeds so index order ≠ speed order
  const speeds = state.map((t) => t.speed);
  for (let i = speeds.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [speeds[i], speeds[j]] = [speeds[j], speeds[i]];
  }
  state.forEach((t, i) => {
    t.speed = speeds[i];
  });

  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    for (const t of state) {
      if (t.waitUntil && now < t.waitUntil) {
        t.el.style.opacity = "0";
        continue;
      }

      if (now >= t.nextSpeedAt) {
        t.speed = rollSpeed(t.speed);
        t.swayAmp = rand(0.15, 1.15);
        t.swayFreq = rand(0.08, 0.65);
        t.rotAmp = rand(2, 11);
        t.nextSpeedAt = now + rand(1800, 9000);
      }

      t.y += t.speed * dt;

      if (t.y > 125) {
        // random pause before re-entry → breaks any remaining sync
        t.y = rand(-30, -12);
        t.waitUntil = now + rand(200, 2800);
        placeX(t.el, t.side);
        t.el.style.width = `${rand(1.15, 2.25)}rem`;
        t.baseOpacity = rand(0.45, 0.88);
        t.flip = Math.random() < 0.45 ? -1 : 1;
        t.phase = rand(0, Math.PI * 2);
        t.speed = rollSpeed(t.speed);
        t.nextSpeedAt = now + rand(1800, 8000);
        t.el.style.opacity = "0";
        continue;
      }

      const sway =
        Math.sin(now * 0.001 * t.swayFreq * Math.PI * 2 + t.phase) *
        t.swayAmp *
        (t.side === "left" ? 1 : -1);
      const rot =
        Math.sin(now * 0.001 * t.swayFreq * 1.25 + t.phase) * t.rotAmp;

      let opacity = t.baseOpacity;
      if (t.y < 0) opacity *= Math.max(0, (t.y + 28) / 28);
      if (t.y > 105) opacity *= Math.max(0, (125 - t.y) / 20);

      t.el.style.opacity = String(opacity);
      t.el.style.transform = `translate3d(${sway}rem, ${t.y}vh, 0) scaleX(${t.flip}) rotate(${rot}deg)`;
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();
