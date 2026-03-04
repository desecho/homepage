(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const r of s)
      if (r.type === "childList")
        for (const a of r.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(s) {
    const r = {};
    return (
      s.integrity && (r.integrity = s.integrity),
      s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const r = i(s);
    fetch(s.href, r);
  }
})();
const u = "flappy.ts.v1.bestScore",
  d = 1 / 60,
  w = 0.1,
  S = {
    world: { width: 360, height: 640, groundHeight: 112, topBoundary: 0 },
    physics: { gravity: 1550, flapVelocity: -420, maxFallSpeed: 680, maxRiseSpeed: -560 },
    pipes: { speed: 155, spawnInterval: 1.38, gapHeight: 168, width: 72, startX: 420, minGapY: 170, maxGapY: 420 },
    ground: { speed: 155, stripeWidth: 36 },
    bird: { startX: 112, startY: 300, radius: 14, readyBobAmplitude: 9, readyBobFrequency: 2.8 },
  };
function b() {
  return {
    skyTop: "#8ad5ff",
    skyBottom: "#bceaff",
    layers: [
      { speed: 14, offset: 0, y: 355, height: 86, color: "#9ddc90" },
      { speed: 28, offset: 0, y: 395, height: 102, color: "#7bc46f" },
      { speed: 44, offset: 0, y: 430, height: 118, color: "#62b95f" },
    ],
    cloudOffset: 0,
  };
}
function T(t) {
  return { x: t.startX, y: t.startY, vy: 0, radius: t.radius, rotation: 0 };
}
function v(t, e) {
  (t.x = e.startX), (t.y = e.startY), (t.vy = 0), (t.rotation = 0);
}
function p(t, e) {
  (t.vy = e), (t.rotation = -0.55);
}
function I() {
  return { offset: 0 };
}
const R = { ready: { start: "playing" }, playing: { die: "gameOver" }, gameOver: { reset: "ready" } };
function c(t, e) {
  return R[t][e] ?? t;
}
class P {
  context = null;
  unlock() {
    typeof window > "u" ||
      (this.context || (this.context = new AudioContext()),
      this.context.state === "suspended" && this.context.resume());
  }
  playFlap() {
    this.playTone({ frequency: 560, duration: 0.08, type: "square", gain: 0.055 });
  }
  playScore() {
    this.playTone({ frequency: 980, duration: 0.12, type: "triangle", gain: 0.06 });
  }
  playHit() {
    this.playTone({ frequency: 210, duration: 0.18, type: "sawtooth", gain: 0.075 });
  }
  playDie() {
    this.playTone({ frequency: 130, duration: 0.26, type: "square", gain: 0.065 });
  }
  playTone(e) {
    if (!this.context) return;
    const i = this.context,
      n = i.currentTime,
      s = i.createOscillator(),
      r = i.createGain();
    (s.type = e.type),
      (s.frequency.value = e.frequency),
      r.gain.setValueAtTime(1e-4, n),
      r.gain.linearRampToValueAtTime(e.gain, n + 0.01),
      r.gain.exponentialRampToValueAtTime(1e-4, n + e.duration),
      s.connect(r),
      r.connect(i.destination),
      s.start(n),
      s.stop(n + e.duration + 0.03);
  }
}
function A(t, e, i) {
  const n = t.x - t.radius,
    s = t.x + t.radius,
    r = t.y - t.radius,
    a = t.y + t.radius;
  if (r <= i.topBoundary || a >= i.height - i.groundHeight) return !0;
  for (const o of e) {
    if (s < o.x || n > o.x + o.width) continue;
    const l = o.gapY - o.gapHeight / 2,
      m = o.gapY + o.gapHeight / 2;
    if (r <= l || a >= m) return !0;
  }
  return !1;
}
const k = new Set(["Space", "ArrowUp", "KeyW", "Enter"]);
class E {
  target;
  handlers;
  interacted = !1;
  constructor(e, i) {
    (this.target = e),
      (this.handlers = i),
      window.addEventListener("keydown", this.handleKeyDown),
      this.target.addEventListener("pointerdown", this.handlePointerDown, { passive: !1 });
  }
  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown),
      this.target.removeEventListener("pointerdown", this.handlePointerDown);
  }
  markInteraction() {
    this.interacted || ((this.interacted = !0), this.handlers.onFirstInteraction?.());
  }
  fireAction() {
    this.markInteraction(), this.handlers.onAction();
  }
  handleKeyDown = (e) => {
    e.repeat || !k.has(e.code) || (e.preventDefault(), this.fireAction());
  };
  handlePointerDown = (e) => {
    e.preventDefault(), this.fireAction();
  };
}
function g(t, e, i) {
  return t < e ? e : t > i ? i : t;
}
function M(t, e, i) {
  (t.vy += i.gravity * e), (t.vy = g(t.vy, i.maxRiseSpeed, i.maxFallSpeed)), (t.y += t.vy * e);
  const n = (t.vy - i.maxRiseSpeed) / (i.maxFallSpeed - i.maxRiseSpeed);
  t.rotation = g(-0.65 + n * 1.65, -0.7, 0.95);
}
function H(t, e, i) {
  return { id: t, x: i.startX, gapY: e, gapHeight: i.gapHeight, width: i.width, passed: !1 };
}
function O(t, e, i) {
  return e + t() * (i - e);
}
function B() {
  return { pipes: [], spawnTimer: 0, nextId: 1 };
}
function F(t) {
  (t.pipes = []), (t.spawnTimer = 0), (t.nextId = 1);
}
function L(t, e, i, n = Math.random) {
  const s = i.speed * e;
  for (const r of t.pipes) r.x -= s;
  for (t.pipes = t.pipes.filter((r) => r.x + r.width >= 0), t.spawnTimer += e; t.spawnTimer >= i.spawnInterval; ) {
    t.spawnTimer -= i.spawnInterval;
    const r = O(n, i.minGapY, i.maxGapY);
    t.pipes.push(H(t.nextId, r, i)), (t.nextId += 1);
  }
}
function q(t, e, i) {
  const n = t.createLinearGradient(0, 0, 0, i.height);
  n.addColorStop(0, e.skyTop), n.addColorStop(1, e.skyBottom), (t.fillStyle = n), t.fillRect(0, 0, i.width, i.height);
}
function C(t, e, i) {
  t.fillStyle = "rgba(255, 255, 255, 0.68)";
  const n = 140,
    s = -n + (e.cloudOffset % n);
  for (let r = s; r < i.width + n; r += n) {
    const a = 88 + ((r / 29) % 3) * 16;
    t.beginPath(),
      t.arc(r, a, 19, 0, Math.PI * 2),
      t.arc(r + 22, a + 4, 14, 0, Math.PI * 2),
      t.arc(r - 20, a + 6, 12, 0, Math.PI * 2),
      t.fill();
  }
}
function Y(t, e, i) {
  for (const n of e.layers) {
    const s = -(n.offset % i.width);
    t.fillStyle = n.color;
    for (let r = s - i.width; r < i.width * 2; r += i.width)
      t.beginPath(),
        t.moveTo(r, i.height - i.groundHeight),
        t.quadraticCurveTo(r + i.width * 0.25, n.y, r + i.width * 0.5, i.height - i.groundHeight),
        t.quadraticCurveTo(r + i.width * 0.75, n.y - n.height, r + i.width, i.height - i.groundHeight),
        t.closePath(),
        t.fill();
  }
}
function D(t, e, i) {
  (t.fillStyle = "#67c45f"), (t.strokeStyle = "#388a34"), (t.lineWidth = 2);
  for (const n of e) {
    const s = n.gapY - n.gapHeight / 2,
      r = n.gapY + n.gapHeight / 2,
      a = 18;
    t.fillRect(n.x, 0, n.width, s),
      t.strokeRect(n.x, 0, n.width, s),
      t.fillRect(n.x - 4, s - a, n.width + 8, a),
      t.strokeRect(n.x - 4, s - a, n.width + 8, a);
    const o = i.height - i.groundHeight - r;
    t.fillRect(n.x, r, n.width, o),
      t.strokeRect(n.x, r, n.width, o),
      t.fillRect(n.x - 4, r, n.width + 8, a),
      t.strokeRect(n.x - 4, r, n.width + 8, a);
  }
}
function G(t, e, i, n) {
  const s = e.height - e.groundHeight;
  (t.fillStyle = "#dcbc62"), t.fillRect(0, s, e.width, e.groundHeight), (t.fillStyle = "#c7a94f");
  const r = -(i.offset % n.stripeWidth);
  for (let a = r; a < e.width + n.stripeWidth; a += n.stripeWidth)
    t.fillRect(a, s + 10, n.stripeWidth / 2, e.groundHeight - 10);
  (t.fillStyle = "#8a6732"), t.fillRect(0, s, e.width, 12);
}
function W(t, e) {
  t.save(),
    t.translate(e.x, e.y),
    t.rotate(e.rotation),
    (t.fillStyle = "#ffd23f"),
    t.beginPath(),
    t.arc(0, 0, e.radius, 0, Math.PI * 2),
    t.fill(),
    (t.fillStyle = "#f49a24"),
    t.beginPath(),
    t.moveTo(e.radius - 1, 0),
    t.lineTo(e.radius + 11, -4),
    t.lineTo(e.radius + 11, 4),
    t.closePath(),
    t.fill(),
    (t.fillStyle = "#f8b725"),
    t.beginPath(),
    t.ellipse(-4, 4, 8, 5, -0.3, 0, Math.PI * 2),
    t.fill(),
    (t.fillStyle = "#1b1b1b"),
    t.beginPath(),
    t.arc(4, -4, 2.6, 0, Math.PI * 2),
    t.fill(),
    t.restore();
}
function N(t, e, i) {
  (t.textAlign = "center"),
    (t.textBaseline = "top"),
    (t.font = "700 48px Trebuchet MS"),
    (t.fillStyle = "#ffffff"),
    (t.strokeStyle = "rgba(0, 0, 0, 0.35)"),
    (t.lineWidth = 5);
  const n = String(e);
  t.strokeText(n, i.width / 2, 22), t.fillText(n, i.width / 2, 22);
}
function V(t, e, i) {
  (t.fillStyle = "rgba(0, 0, 0, 0.18)"),
    t.fillRect(0, 0, i.width, i.height),
    (t.textAlign = "center"),
    (t.fillStyle = "#ffffff"),
    (t.font = "700 40px Trebuchet MS"),
    t.fillText("Flappy bird", i.width / 2, 164),
    (t.font = "700 20px Trebuchet MS"),
    t.fillText("Tap, Click, or Space", i.width / 2, 232),
    t.fillText("to flap", i.width / 2, 260),
    (t.font = "700 18px Trebuchet MS"),
    t.fillText(`Best: ${e}`, i.width / 2, 298);
}
function _(t, e, i, n) {
  (t.fillStyle = "rgba(0, 0, 0, 0.24)"), t.fillRect(0, 0, n.width, n.height);
  const s = 264,
    r = 192,
    a = (n.width - s) / 2,
    o = 146;
  (t.fillStyle = "#f7f2e3"),
    (t.strokeStyle = "#4a3a1b"),
    (t.lineWidth = 3),
    t.fillRect(a, o, s, r),
    t.strokeRect(a, o, s, r),
    (t.textAlign = "center"),
    (t.fillStyle = "#4a3a1b"),
    (t.font = "700 30px Trebuchet MS"),
    t.fillText("Game Over", n.width / 2, o + 26),
    (t.font = "700 22px Trebuchet MS"),
    t.fillText(`Score: ${e}`, n.width / 2, o + 88),
    t.fillText(`Best: ${i}`, n.width / 2, o + 122),
    (t.font = "700 18px Trebuchet MS"),
    t.fillText("Tap / Space to restart", n.width / 2, o + 162);
}
function z(t, e, i, n, s, r) {
  if (r) {
    for (const a of t.layers) a.offset = (a.offset + a.speed * i) % n.width;
    (t.cloudOffset = (t.cloudOffset + 8 * i) % n.width), (e.offset = (e.offset + s.speed * i) % s.stripeWidth);
  }
}
function K(t, e, i) {
  q(t, e.background, e.world),
    C(t, e.background, e.world),
    Y(t, e.background, e.world),
    D(t, e.pipes, e.world),
    G(t, e.world, e.ground, i),
    W(t, e.bird),
    (e.state === "playing" || e.state === "gameOver") && N(t, e.score, e.world),
    e.state === "ready" && V(t, e.bestScore, e.world),
    e.state === "gameOver" && _(t, e.score, e.bestScore, e.world);
}
function X(t, e, i) {
  let n = t;
  for (const s of i) {
    const r = s.x + s.width / 2;
    !s.passed && e.x > r && ((s.passed = !0), (n += 1));
  }
  return n;
}
function $(t, e) {
  try {
    const i = localStorage.getItem(t);
    if (i === null) return e;
    const n = Number.parseInt(i, 10);
    return Number.isFinite(n) ? n : e;
  } catch {
    return e;
  }
}
function U(t, e) {
  try {
    localStorage.setItem(t, String(e));
  } catch {}
}
function j(t) {
  return t / 1e3;
}
function J(t, e) {
  return t > e ? e : t;
}
class Q {
  canvas;
  context;
  config;
  input;
  audio;
  state = "ready";
  score = 0;
  bestScore = 0;
  bird;
  pipeState;
  background;
  ground;
  running = !1;
  rafId = null;
  lastTimestamp = null;
  accumulator = 0;
  elapsedSeconds = 0;
  constructor(e, i = S) {
    const n = e.getContext("2d");
    if (!n) throw new Error("Unable to get 2D rendering context");
    (this.canvas = e),
      (this.context = n),
      (this.config = i),
      (this.canvas.width = this.config.world.width),
      (this.canvas.height = this.config.world.height),
      (this.bird = T(this.config.bird)),
      (this.pipeState = B()),
      (this.background = b()),
      (this.ground = I()),
      (this.bestScore = $(u, 0)),
      (this.audio = new P()),
      (this.input = new E(this.canvas, { onAction: this.handleAction, onFirstInteraction: () => this.audio.unlock() })),
      window.addEventListener("resize", this.handleResize),
      document.addEventListener("visibilitychange", this.handleVisibilityChange),
      this.handleResize(),
      this.render();
  }
  start() {
    this.running || ((this.running = !0), (this.lastTimestamp = null), (this.rafId = requestAnimationFrame(this.tick)));
  }
  destroy() {
    (this.running = !1),
      this.rafId !== null && (cancelAnimationFrame(this.rafId), (this.rafId = null)),
      this.input.destroy(),
      window.removeEventListener("resize", this.handleResize),
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
  handleAction = () => {
    if (this.state === "ready") {
      (this.state = c(this.state, "start")), p(this.bird, this.config.physics.flapVelocity);
      return;
    }
    if (this.state === "playing") {
      p(this.bird, this.config.physics.flapVelocity);
      return;
    }
    this.state === "gameOver" && this.resetToReady();
  };
  resetToReady() {
    (this.state = c(this.state, "reset")),
      (this.score = 0),
      (this.elapsedSeconds = 0),
      v(this.bird, this.config.bird),
      F(this.pipeState);
  }
  handleResize = () => {
    const e = window.innerWidth - 20,
      i = window.innerHeight - 20,
      n = Math.max(0.1, Math.min(e / this.config.world.width, i / this.config.world.height));
    (this.canvas.style.width = `${Math.floor(this.config.world.width * n)}px`),
      (this.canvas.style.height = `${Math.floor(this.config.world.height * n)}px`);
  };
  handleVisibilityChange = () => {
    document.visibilityState === "hidden" && (this.lastTimestamp = null);
  };
  tick = (e) => {
    if (!this.running) return;
    this.lastTimestamp === null && (this.lastTimestamp = e);
    const i = j(e - this.lastTimestamp),
      n = J(i, w);
    for (this.lastTimestamp = e, this.accumulator += n; this.accumulator >= d; )
      this.update(d), (this.accumulator -= d);
    this.render(), (this.rafId = requestAnimationFrame(this.tick));
  };
  update(e) {
    this.elapsedSeconds += e;
    const i = this.state === "ready" || this.state === "playing";
    if ((z(this.background, this.ground, e, this.config.world, this.config.ground, i), this.state === "ready")) {
      const { startY: r, readyBobAmplitude: a, readyBobFrequency: o } = this.config.bird,
        l = Math.sin(this.elapsedSeconds * o * Math.PI * 2);
      (this.bird.y = r + l * a), (this.bird.vy = 0), (this.bird.rotation = l * 0.05);
      return;
    }
    if (this.state !== "playing") return;
    M(this.bird, e, this.config.physics), L(this.pipeState, e, this.config.pipes);
    const n = this.score;
    (this.score = X(this.score, this.bird, this.pipeState.pipes)),
      this.score > n && this.audio.playScore(),
      A(this.bird, this.pipeState.pipes, this.config.world) &&
        ((this.state = c(this.state, "die")),
        this.audio.playHit(),
        this.audio.playDie(),
        this.score > this.bestScore && ((this.bestScore = this.score), U(u, this.bestScore)));
  }
  render() {
    const e = {
      state: this.state,
      score: this.score,
      bestScore: this.bestScore,
      bird: this.bird,
      pipes: this.pipeState.pipes,
      background: this.background,
      ground: this.ground,
      world: this.config.world,
    };
    K(this.context, e, this.config.ground);
  }
}
const y = document.querySelector("#app");
if (!y) throw new Error("Missing #app root element");
const f = document.createElement("main");
f.className = "game-shell";
const h = document.createElement("canvas");
h.className = "game-canvas";
h.setAttribute("role", "img");
h.setAttribute("aria-label", "Flappy bird clone game area");
f.appendChild(h);
y.appendChild(f);
const Z = new Q(h);
Z.start();
