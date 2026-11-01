// Calm music for logged-in students.
//
// By default the browser composes soft music live (no files, no copyright, never repeats).
// To use real recordings instead, put mp3 files in a folder called "music" next to this file
// and list them here, for example: const TRACKS = ["music/slow-piano.mp3", "music/rain.mp3"];
// Only use tracks you have the right to share, and credit the artist in the page footer if the license asks for it.
import { auth, onAuthStateChanged } from "./firebase.js";

const TRACKS = [];

const slot = document.getElementById("music-slot");
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage can be blocked, that's fine */ } }
};

// ---------- Engine 1: calm music composed live with Web Audio ----------
function makeComposer() {
  let ctx = null, master = null, bus = null, timers = [], step = 0, volume = 0.5, playing = false;

  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const level = () => 0.55 * volume * volume;
  const CHORDS = [[48, 55, 64], [45, 52, 60], [41, 53, 60], [43, 50, 59]]; // C, Am, F, G
  const SCALE = [60, 62, 64, 67, 69, 72, 74, 76, 79];                       // C major pentatonic

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = 0;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2200;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(3.2, 2.4);
    const dry = ctx.createGain(); dry.gain.value = 0.8;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    bus = ctx.createGain();
    bus.connect(dry); dry.connect(tone);
    bus.connect(verb); verb.connect(wet); wet.connect(tone);
    tone.connect(master); master.connect(ctx.destination);
  }

  function pad(m, t, dur) {
    for (const [type, mult, peak] of [["sine", 1, 0.05], ["triangle", 1.004, 0.02]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.value = midi(m) * mult;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 2.2);
      g.gain.setValueAtTime(peak, t + dur - 1);
      g.gain.linearRampToValueAtTime(0, t + dur + 2.5);
      o.connect(g); g.connect(bus);
      o.start(t); o.stop(t + dur + 2.6);
    }
  }

  function pluck(m, t) {
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    for (const [type, mult, vol] of [["sine", 1, 1], ["triangle", 2, 0.18]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type;
      o.frequency.value = midi(m) * mult;
      og.gain.value = vol;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + 3.4);
    }
    if (pan) { pan.pan.value = Math.random() * 1 - 0.5; g.connect(pan); pan.connect(bus); } else g.connect(bus);
  }

  let last = -1;
  function melody() {
    let i;
    do { i = Math.floor(Math.random() * SCALE.length); } while (i === last);
    last = i;
    pluck(SCALE[i], ctx.currentTime + 0.05);
    timers.push(setTimeout(melody, 1500 + Math.random() * 2800));
  }
  function chords() {
    const c = CHORDS[step++ % CHORDS.length];
    c.forEach((m) => pad(m, ctx.currentTime + 0.05, 8));
    timers.push(setTimeout(chords, 8000));
  }

  return {
    label: "Slow pencil, composed live by your browser, so it never repeats.",
    async play() {
      if (!ctx) build();
      await ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(level(), ctx.currentTime, 0.4);
      if (!playing) { playing = true; chords(); timers.push(setTimeout(melody, 1200)); }
    },
    pause() {
      if (!ctx || !playing) return;
      playing = false;
      timers.forEach(clearTimeout); timers = [];
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      setTimeout(() => { if (!playing) ctx.suspend(); }, 1200);
    },
    setVolume(v) {
      volume = v;
      if (ctx && playing) master.gain.setTargetAtTime(level(), ctx.currentTime, 0.1);
    }
  };
}

// ---------- Engine 2: your own mp3 files ----------
function makeFiles() {
  const audio = new Audio();
  let i = 0;
  audio.preload = "none";
  audio.src = TRACKS[0];
  audio.loop = TRACKS.length === 1;
  audio.addEventListener("ended", () => { i = (i + 1) % TRACKS.length; audio.src = TRACKS[i]; audio.play().catch(() => {}); });
  return {
    label: "Calm music for studying.",
    play: () => audio.play(),
    pause: () => audio.pause(),
    setVolume: (v) => { audio.volume = v; }
  };
}

// ---------- The little control panel ----------
function mount() {
  const engine = TRACKS.length ? makeFiles() : makeComposer();
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-pressed", "false");

  const vol = document.createElement("input");
  vol.type = "range"; vol.id = "music-volume"; vol.min = "0"; vol.max = "100"; vol.step = "5";
  vol.value = store.get("gps-volume", "50");
  const volLabel = document.createElement("label");
  volLabel.htmlFor = "music-volume";
  volLabel.textContent = "volume ";

  const hint = document.createElement("span");
  hint.className = "hint";
  hint.textContent = engine.label;

  const msg = document.createElement("span");
  msg.className = "hint";
  msg.setAttribute("role", "status");

  let on = false;
  const paint = () => {
    btn.textContent = on ? "Pause music" : "Play music";
    btn.setAttribute("aria-pressed", String(on));
  };
  const setVol = () => { engine.setVolume(Number(vol.value) / 100); store.set("gps-volume", vol.value); };

  btn.addEventListener("click", async () => {
    msg.textContent = "";
    try {
      if (on) { engine.pause(); on = false; }
      else { setVol(); await engine.play(); on = true; }
    } catch (err) {
      on = false;
      msg.textContent = "Your browser wouldn't start the music. Try again, or check that the page isn't muted.";
    }
    paint();
  });
  vol.addEventListener("input", setVol);

  slot.replaceChildren(btn, volLabel, vol, hint, msg);
  setVol(); paint();

  return () => { if (on) { engine.pause(); on = false; paint(); } };
}

if (slot) {
  let stop = null;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      slot.hidden = false;
      if (!stop) stop = mount();
    } else {
      if (stop) { stop(); stop = null; }
      slot.hidden = true;
      slot.replaceChildren();
    }
  });
}
