import { Cell } from './Cell.js';

export class SceneNode {
  constructor(props = {}) {
    this.parent = null;
    this.children = [];
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.width = props.width || 0;
    this.height = props.height || 0;
    this.visible = props.visible !== false;
    this.zIndex = props.zIndex || 0;
    this.id = props.id || Math.random().toString(36).substr(2, 9);
    this.props = props;
  }

  add(child) {
    if (child.parent) child.parent.remove(child);
    child.parent = this;
    this.children.push(child);
    this.sortChildren();
  }

  addChild(child) { this.add(child); } // Alias for compatibility

  remove(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
  }

  sortChildren() {
    this.children.sort((a, b) => a.zIndex - b.zIndex);
  }

  // Calculate absolute position in world space
  get absPosition() {
    let x = this.x;
    let y = this.y;
    let curr = this.parent;
    while (curr) {
      x += curr.x;
      y += curr.y;
      curr = curr.parent;
    }
    return { x, y };
  }

  // Hit test in world coordinates
  hitTest(worldX, worldY) {
    if (!this.visible) return null;

    const { x, y } = this.absPosition;

    // Check bounds
    if (worldX < x || worldX >= x + this.width ||
        worldY < y || worldY >= y + this.height) {
      return null;
    }

    // Check children (reverse z-order for top-most)
    for (let i = this.children.length - 1; i >= 0; i--) {
      const hit = this.children[i].hitTest(worldX, worldY);
      if (hit) return hit;
    }

    return { node: this, x: worldX, y: worldY };
  }

  render(renderer) {
    if (!this.visible) return;

    this._lastAbsPosition = this.absPosition;
    this.onRender(renderer);

    // Render children
    for (const child of this.children) {
      child.render(renderer);
    }
  }

  tick(dt, t) {
    if (!this.visible) return;
    if (this.onTick) this.onTick(dt, t);
    for (const child of this.children) {
      if (child.tick) child.tick(dt, t);
    }
  }

  onRender(renderer) {
    // Override me
  }
}
