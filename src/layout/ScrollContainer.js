import { Component } from '../components/Component.js';

export class ScrollContainer extends Component {
  constructor(props) {
    super(props);
    this.state.scrollX = 0;
    this.state.scrollY = 0;
  }

  clampScroll() {
    if (this.state.scrollX < 0) this.state.scrollX = 0;
    if (this.state.scrollY < 0) this.state.scrollY = 0;
    const contentHeight = this.props.contentHeight ?? this.contentHeight;
    if (contentHeight) {
      const maxScrollY = Math.max(0, contentHeight - this.height);
      if (this.state.scrollY > maxScrollY) this.state.scrollY = maxScrollY;
    }
  }

  scrollTo(y) {
    this.state.scrollY = Math.max(0, Math.floor(y));
    this.clampScroll();
  }

  // Override hitTest to account for scroll offset
  hitTest(worldX, worldY) {
    if (!this.visible) return null;

    const { x, y } = this.absPosition;

    // Check bounds of the container itself
    if (worldX < x || worldX >= x + this.width ||
      worldY < y || worldY >= y + this.height) {
      return null;
    }

    const scrolledX = worldX + this.state.scrollX;
    const scrolledY = worldY + this.state.scrollY;

    for (let i = this.children.length - 1; i >= 0; i--) {
      const hit = this.children[i].hitTest(scrolledX, scrolledY);
      if (hit) return hit;
    }

    return { node: this, x: worldX, y: worldY };
  }

  // Override render to clip
  render(renderer) {
    if (!this.visible) return;

    // Draw border
    this.onRender(renderer); // Draw box

    // Render children with offset AND clipping
    // Renderer needs clip support?
    // We can just simulate clipping by only rendering children that are in bounds
    // Or we modify the renderer to support a clip rect stack.

    // Since we don't have clip stack yet, let's just offset.
    // Children render relative to parent.
    // Wait, Node.js renders children automatically.
    // We need to override render() to offset children positions temporarily.

    const { x, y } = this.absPosition;

    // Temporarily offset children for scroll position
    for (const child of this.children) {
      child.x -= this.state.scrollX;
      child.y -= this.state.scrollY;
      child.render(renderer);
      child.x += this.state.scrollX;
      child.y += this.state.scrollY;
    }
  }

  onRender(renderer) {
    const { fg, bg } = this.getColors(renderer);
    const { x, y } = this.absPosition;
    renderer.box(x, y, this.width, this.height, 'single', fg, bg);
  }

  onWheel(e) {
    this.state.scrollY += e.deltaY > 0 ? 1 : -1;
    this.clampScroll();
  }
}
