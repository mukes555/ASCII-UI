import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { SceneNode } from './SceneNode.js';

export class Engine {
  constructor(containerId, options = {}) {
    this.renderer = new Renderer(containerId, options);
    this.root = new SceneNode({ width: this.renderer.cols, height: this.renderer.rows });
    this.renderScheduled = false;
    this.continuousRender = !!options.continuousRender;
    this._looping = false;
    this.onResize = typeof options.onResize === 'function' ? options.onResize : null;
    this.afterResize = null;
    this.onTick = typeof options.onTick === 'function' ? options.onTick : null;
    this.input = new InputManager(this.renderer, this.root, () => this.scheduleRender());

    if (options.autoSize) {
      window.addEventListener('resize', () => {
        this.renderer.resize();
        this.root.width = this.renderer.cols;
        this.root.height = this.renderer.rows;
        if (this.onResize) this.onResize(this.renderer.cols, this.renderer.rows);
        if (this.afterResize) this.afterResize(this.renderer.cols, this.renderer.rows);
        this.scheduleRender();
      });
      this.renderer.resize();
      this.root.width = this.renderer.cols;
      this.root.height = this.renderer.rows;
      if (this.onResize) this.onResize(this.renderer.cols, this.renderer.rows);
      if (this.afterResize) this.afterResize(this.renderer.cols, this.renderer.rows);
    }

    if (this.continuousRender) this.startLoop();
    else this.scheduleRender();
  }

  add(component) {
    this.root.add(component);
    this.scheduleRender();
  }

  startLoop() {
    if (this._looping) return;
    this._looping = true;
    let last = performance.now();
    const tick = () => {
      if (!this._looping) return;
      try {
        const now = performance.now();
        const dt = Math.min(100, now - last);
        last = now;
        if (this.onTick) this.onTick(dt, now);
        if (this.root.tick) this.root.tick(dt, now);
        this.render();
        requestAnimationFrame(tick);
      } catch (e) {
        this.stopLoop();
        throw e;
      }
    };
    requestAnimationFrame(tick);
  }

  stopLoop() {
    this._looping = false;
  }

  scheduleRender() {
    if (this._looping) return;
    if (this.renderScheduled) return;
    this.renderScheduled = true;
    requestAnimationFrame(() => {
      try {
        this.renderScheduled = false;
        this.render();
      } catch (e) {
        this.renderScheduled = false;
        throw e;
      }
    });
  }

  render() {
    this.renderer.clear();
    this.root.render(this.renderer);
    this.renderer.flush();
  }
}
