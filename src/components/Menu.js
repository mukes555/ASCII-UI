import { Component } from './Component.js';

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.openSubmenu = null;
    this.state.activeIndex = -1;
  }

  onRender(renderer) {
    const { fg, bg } = this.getColors(renderer);
    const { x, y } = this.absPosition;
    const items = this.props.items || [];
    const horizontal = this.props.orientation !== 'vertical';

    // Background
    renderer.rect(x, y, this.width, this.height, ' ', fg, bg);

    let cx = x;
    let cy = y;

    items.forEach((item, i) => {
      const active = i === this.state.activeIndex;
      const tfg = active ? renderer.theme.selected.fg : fg;
      const tbg = active ? renderer.theme.selected.bg : bg;
      const label = ` ${item.label} `;

      if (horizontal) {
        renderer.text(cx, cy, label, tfg, tbg);
        cx += label.length;
      } else {
        renderer.text(cx, cy, label, tfg, tbg);
        cy++;
      }
    });

    // Submenu
    if (this.state.openSubmenu !== null) {
      this.renderSubmenu(renderer, this.state.openSubmenu);
    }
  }

  renderSubmenu(renderer, index) {
    const item = this.props.items[index];
    if (!item.submenu) return;

    // Calculate position
    const { x, y } = this.absPosition;
    let sx = x;
    let sy = y + 1;

    if (this.props.orientation !== 'vertical') {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += ` ${this.props.items[i].label} `.length;
      }
      sx += offset;
    } else {
      sy = y + index;
      sx += this.width;
    }

    // Draw submenu box
    const sw = 20;
    const sh = item.submenu.length + 2;
    // Just draw on top for now, z-index should handle it if separate component
    // But here we draw manually.
    const theme = renderer.theme;
    renderer.box(sx, sy, sw, sh, 'single', theme.normal.fg, theme.normal.bg);

    item.submenu.forEach((sub, i) => {
      renderer.text(sx + 1, sy + 1 + i, sub.label, theme.normal.fg, theme.normal.bg);
    });
  }

  onClick(e, gx, gy) {
    // Determine clicked item
    const { x, y } = this.absPosition;
    const items = this.props.items || [];
    const horizontal = this.props.orientation !== 'vertical';

    if (this.state.openSubmenu !== null) {
        // Check submenu click first (basic check)
        // This is tricky without separate component for submenu.
        // We'll close for now if clicking outside main bar.
        // To fix properly, submenu should be a child component.
        // For this demo rewrite, let's just focus on main bar.
    }

    let cx = x;
    let cy = y;

    for (let i = 0; i < items.length; i++) {
      const label = ` ${items[i].label} `;
      if (horizontal) {
        if (gy === cy && gx >= cx && gx < cx + label.length) {
          this.activate(i);
          return;
        }
        cx += label.length;
      } else {
        if (gy === cy && gx >= cx && gx < cx + this.width) {
          this.activate(i);
          return;
        }
        cy++;
      }
    }
  }

  activate(index) {
    this.state.activeIndex = index;
    const item = this.props.items[index];
    if (item.action) {
      item.action();
      this.state.openSubmenu = null;
    } else if (item.submenu) {
      this.state.openSubmenu = index === this.state.openSubmenu ? null : index;
    }
  }
}
