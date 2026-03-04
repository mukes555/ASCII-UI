import { Component } from './Component.js';

export class ListView extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.props.on = this.props.on || {}; // Ensure 'on' object exists
    this.state.selectedIndex = 0;
    this.state.scrollOffset = 0;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const bfg = theme.border?.fg || fg;
    const { x, y } = this.absPosition;
    const items = this.props.items || [];
    const maxVisible = this.props.maxVisible || 10;

    const borderStyle = this.props.borderStyle || theme.borders?.panel || 'single';
    const fillBg = this.props.bg || theme.surface?.bg || bg;
    const fillFg = this.props.fg || theme.surface?.fg || fg;
    if (this.width > 2 && this.height > 2) {
      renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fillFg, fillBg);
    }
    renderer.box(x, y, this.width, this.height, borderStyle, bfg, fillBg);

    for (let i = 0; i < maxVisible; i++) {
      const idx = this.state.scrollOffset + i;
      if (idx >= items.length) break;

      const item = items[idx];
      const label = typeof item === 'string' ? item : item.label;
      const isSelected = this.state.selectedIndex === idx;

      const ifg = isSelected ? theme.selected?.fg : fg;
      const ibg = isSelected ? theme.selected?.bg : bg;

      // Full row highlight
      if (isSelected) {
        renderer.rect(x + 1, y + 1 + i, this.width - 2, 1, ' ', ifg, ibg);
      }
      renderer.text(x + 2, y + 1 + i, label, ifg, ibg);
    }
  }

  onKeyDown(e) {
    const items = this.props.items || [];
    if (e.key === 'ArrowDown') {
      this.state.selectedIndex = Math.min(this.state.selectedIndex + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      this.state.selectedIndex = Math.max(this.state.selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
        this.selectItem(this.state.selectedIndex);
    }
  }

  onClick(e, x, y) {
    const { x: absX, y: absY } = this.absPosition;

    // Relative position
    const relY = y - absY;

    // Header is usually 1px border? Box starts at y.
    // Content starts at y+1.
    const row = relY - 1;

    if (row >= 0 && row < (this.props.maxVisible || 10)) {
        const idx = this.state.scrollOffset + row;
        if (idx < (this.props.items || []).length) {
            this.state.selectedIndex = idx;
            this.selectItem(idx);
        }
    }
  }

  selectItem(idx) {
      const item = (this.props.items || [])[idx];
      if (this.props.on && this.props.on.select) {
          this.props.on.select(item);
      } else if (this.on && this.on.select) {
          this.on.select(item);
      }
  }
}
