import { SceneNode } from '../core/SceneNode.js';

export class Component extends SceneNode {
  constructor(props = {}) {
    super(props);
    this.state = {};
    this.on = props.on || {}; // Helper for direct assignment
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  // Helper to get theme colors
  getColors(renderer) {
    const theme = renderer.theme;
    if (this.props.disabled) return theme.disabled;
    if (this.state.focused) return theme.focused;
    if (this.state.hovered && this.props.highlightOnHover !== false) return theme.hovered;
    return theme.normal;
  }

  onMouseEnter() { this.state.hovered = true; }
  onMouseLeave() { this.state.hovered = false; }
  // Compatibility aliases
  addChild(child) { this.add(child); }
  removeChild(child) { this.remove(child); }
}
