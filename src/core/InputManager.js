import { SceneNode } from './SceneNode.js';

export class InputManager {
  constructor(renderer, rootNode, invalidate) {
    this.renderer = renderer;
    this.root = rootNode;
    this.invalidate = typeof invalidate === 'function' ? invalidate : () => {};
    this.focused = null;
    this.hovered = null;
    this.mouseDownNode = null;
    this.lastMouse = { x: 0, y: 0 };

    this.setupListeners();
  }

  setupListeners() {
    const el = this.renderer.pre;

    el.addEventListener('mousemove', e => this.handleMouse(e, 'mousemove'));
    el.addEventListener('mousedown', e => this.handleMouse(e, 'mousedown'));
    el.addEventListener('mouseup', e => this.handleMouse(e, 'mouseup'));
    el.addEventListener('wheel', e => this.handleWheel(e), { passive: false });

    // Keyboard support via hidden input
    this.input = document.createElement('textarea');
    Object.assign(this.input.style, { position: 'fixed', opacity: 0, top: 0 });
    document.body.appendChild(this.input);

    this.input.addEventListener('keydown', e => this.dispatchKey(e));
    el.addEventListener('click', () => this.input.focus());
  }

  getGridPos(e) {
    const rect = this.renderer.pre.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / this.renderer.charWidth),
      y: Math.floor((e.clientY - rect.top) / this.renderer.charHeight)
    };
  }

  handleMouse(e, type) {
    const { x, y } = this.getGridPos(e);
    this.lastMouse.x = x;
    this.lastMouse.y = y;
    const hit = this.root.hitTest(x, y);
    const target = hit ? hit.node : null;
    const hitX = hit ? hit.x : x;
    const hitY = hit ? hit.y : y;

    if (type === 'mousemove') {
      if (this.hovered !== target) {
        if (this.hovered?.onMouseLeave) this.hovered.onMouseLeave();
        this.hovered = target;
        if (this.hovered?.onMouseEnter) this.hovered.onMouseEnter();
        this.invalidate();
      }
    }

    if (type === 'mousedown') {
      this.mouseDownNode = target;
      let focusTarget = target;
      while (focusTarget && !focusTarget?.props?.focusable) focusTarget = focusTarget.parent;
      if (focusTarget?.props?.focusable) this.setFocus(focusTarget);
      this.invalidate();
    }

    if (type === 'mouseup') {
      if (this.mouseDownNode === target && target) {
        // Bubble click
        let curr = target;
        while (curr) {
          if (curr.onClick) {
            curr.onClick(e, hitX, hitY, this.renderer);
            break;
          }
          curr = curr.parent;
        }
      }
      this.mouseDownNode = null;
      this.invalidate();
    }
  }

  handleWheel(e) {
    const { x, y } = this.getGridPos(e);
    this.lastMouse.x = x;
    this.lastMouse.y = y;
    let hit = this.root.hitTest(x, y);
    let target = hit ? hit.node : null;

    while(target) {
      if (target.onWheel) {
        target.onWheel(e);
        e.preventDefault();
        const after = this.root.hitTest(x, y);
        const next = after ? after.node : null;
        if (this.hovered !== next) {
          if (this.hovered?.onMouseLeave) this.hovered.onMouseLeave();
          this.hovered = next;
          if (this.hovered?.onMouseEnter) this.hovered.onMouseEnter();
        }
        this.invalidate();
        break;
      }
      target = target.parent;
    }
  }

  dispatchKey(e) {
    if (this.focused?.onKeyDown) {
      this.focused.onKeyDown(e);
      this.invalidate();
    }
  }

  setFocus(node) {
    if (this.focused === node) return;
    if (this.focused?.onBlur) this.focused.onBlur();
    this.focused = node;
    if (this.focused?.onFocus) this.focused.onFocus();
    this.invalidate();
  }
}
