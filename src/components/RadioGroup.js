import { Component } from './Component.js';

export class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.selectedIndex = props.selectedIndex || 0;
    this.state.options = props.options || [];
    this.direction = props.direction || 'vertical';
    this.recomputeBounds();
  }

  recomputeBounds() {
    const options = this.props.options || this.state.options || [];
    const labels = options.map(o => String(o.label ?? ''));
    if (this.direction === 'horizontal') {
      this.width = labels.reduce((sum, l) => sum + (l.length + 5), 0);
      this.height = 1;
    } else {
      this.width = Math.max(0, ...labels.map(l => l.length + 5));
      this.height = labels.length;
    }
    if (this.props.width) this.width = this.props.width;
    if (this.props.height) this.height = this.props.height;
  }

  onRender(renderer) {
    this.recomputeBounds();
    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.normal?.bg;
    const accentFg = theme.ring?.fg ?? theme.focused?.bg ?? fg;
    const mutedFg = theme.muted?.fg ?? fg;
    const { x, y } = this.absPosition;
    const options = this.props.options || this.state.options || [];

    if (this.direction === 'horizontal') {
      let cx = x;
      for (let i = 0; i < options.length; i++) {
        const selected = i === this.state.selectedIndex;
        const label = String(options[i].label ?? '');
        const dot = selected ? '*' : ' ';
        const dotFg = selected ? accentFg : mutedFg;
        renderer.text(cx, y, '(', mutedFg, bg);
        renderer.text(cx + 1, y, dot, dotFg, bg);
        renderer.text(cx + 2, y, ')', mutedFg, bg);
        renderer.text(cx + 4, y, label, selected ? fg : mutedFg, bg);
        cx += label.length + 5;
      }
      return;
    }

    for (let i = 0; i < options.length; i++) {
      const selected = i === this.state.selectedIndex;
      const label = String(options[i].label ?? '');
      const dot = selected ? '*' : ' ';
      const dotFg = selected ? accentFg : mutedFg;
      renderer.text(x, y + i, '(', mutedFg, bg);
      renderer.text(x + 1, y + i, dot, dotFg, bg);
      renderer.text(x + 2, y + i, ')', mutedFg, bg);
      renderer.text(x + 4, y + i, label, selected ? fg : mutedFg, bg);
    }
  }

  onClick(e, gx, gy) {
    const { x, y } = this.absPosition;
    const options = this.props.options || this.state.options || [];
    if (this.direction === 'horizontal') {
      let cx = x;
      for (let i = 0; i < options.length; i++) {
        const label = String(options[i].label ?? '');
        const len = label.length + 5;
        if (gy === y && gx >= cx && gx < cx + len) { this.select(i); return; }
        cx += len;
      }
      return;
    }
    const idx = gy - y;
    if (idx >= 0 && idx < options.length) this.select(idx);
  }

  onKeyDown(e) {
    const options = this.props.options || this.state.options || [];
    if (!options.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      this.select(Math.min(options.length - 1, this.state.selectedIndex + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      this.select(Math.max(0, this.state.selectedIndex - 1));
    } else if (e.key === ' ' || e.key === 'Enter') {
      this.select(this.state.selectedIndex);
    }
  }

  select(idx) {
    this.state.selectedIndex = idx;
    const item = (this.props.options || this.state.options || [])[idx];
    if (this.props.on && this.props.on.change) this.props.on.change(item);
    if (this.on && this.on.change) this.on.change(item);
  }
}
