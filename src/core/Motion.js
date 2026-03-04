export class Motion {
  constructor(requestFrame) {
    this._tweens = [];
    this._springs = [];
    this._requestFrame = requestFrame;
  }

  hasActive() {
    return this._tweens.length > 0 || this._springs.length > 0;
  }

  tween(target, to, opts = {}) {
    const now = performance.now();
    const duration = Math.max(1, Number(opts.duration ?? 350));
    const ease = opts.ease || 'outCubic';
    const from = {};
    for (const k of Object.keys(to || {})) {
      from[k] = Number(target[k] ?? 0);
    }

    const tween = {
      target,
      from,
      to,
      start: now,
      duration,
      ease,
      done: false,
      onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : null
    };
    this._tweens.push(tween);
    if (this._requestFrame) this._requestFrame();
    return () => { tween.done = true; };
  }

  spring(target, to, opts = {}) {
    const stiffness = Math.max(1, Number(opts.stiffness ?? 280));
    const damping = Math.max(1, Number(opts.damping ?? 30));
    const mass = Math.max(0.1, Number(opts.mass ?? 1));
    const threshold = Math.max(0.001, Number(opts.threshold ?? 0.01));

    const springs = [];
    for (const k of Object.keys(to || {})) {
      springs.push({
        target,
        key: k,
        to: Number(to[k] ?? 0),
        v: 0,
        stiffness,
        damping,
        mass,
        threshold,
        done: false
      });
    }
    this._springs.push(...springs);
    if (this._requestFrame) this._requestFrame();
    return () => { for (const s of springs) s.done = true; };
  }

  tick(dtMs) {
    const t = performance.now();

    for (const tw of this._tweens) {
      if (tw.done) continue;
      const p = Math.min(1, (t - tw.start) / tw.duration);
      const e = ease(p, tw.ease);
      for (const k of Object.keys(tw.to || {})) {
        const a = Number(tw.from[k] ?? 0);
        const b = Number(tw.to[k] ?? 0);
        tw.target[k] = a + (b - a) * e;
      }
      if (p >= 1) {
        tw.done = true;
        if (tw.onComplete) tw.onComplete();
      }
    }

    const dt = Math.min(0.05, Math.max(0.001, dtMs / 1000));
    for (const sp of this._springs) {
      if (sp.done) continue;
      const x = Number(sp.target[sp.key] ?? 0);
      const dx = x - sp.to;
      const a = (-sp.stiffness * dx - sp.damping * sp.v) / sp.mass;
      sp.v += a * dt;
      const next = x + sp.v * dt;
      sp.target[sp.key] = next;
      if (Math.abs(next - sp.to) < sp.threshold && Math.abs(sp.v) < sp.threshold) {
        sp.target[sp.key] = sp.to;
        sp.done = true;
      }
    }

    this._tweens = this._tweens.filter(tw => !tw.done);
    this._springs = this._springs.filter(sp => !sp.done);
  }
}

function ease(t, name) {
  if (name === 'linear') return t;
  if (name === 'outCubic') return 1 - Math.pow(1 - t, 3);
  if (name === 'inOutCubic') return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  if (name === 'outQuint') return 1 - Math.pow(1 - t, 5);
  return 1 - Math.pow(1 - t, 3);
}

