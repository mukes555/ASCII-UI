import { Component } from './Component.js';

export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.value = props.value || '';
    this.state.cursorPos = this.state.value.length;
    this.props.width = props.width || 20;
    this.width = this.props.width;
    this.height = 3;
    this.props.placeholder = props.placeholder || '';

  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const fillBg = this.props.bg || theme.surface?.bg || bg;
    const fillFg = this.props.fg || theme.surface?.fg || fg;
    // Always use normal fg for typed text so it's visible against surface bg
    const normalFg = theme.normal?.fg || fg;
    let bfg = theme.border?.fg || fg;
    const { x, y } = this.absPosition;
    const width = this.props.width;

    // Always single border, change COLOR on focus
    const style = this.props.borderStyle || theme.borders?.control || 'single';
    if (this.state.focused) bfg = theme.ring?.fg || theme.focused?.bg || bfg;

    renderer.rect(x + 1, y + 1, Math.max(0, width - 2), 1, ' ', fillFg, fillBg);
    renderer.box(x, y, width, 3, style, bfg, fillBg);

    // Draw Text
    const val = this.state.value;
    const displayVal = val.length > 0 ? val : this.props.placeholder;
    const textFg = val.length > 0 ? normalFg : (theme.placeholder?.fg || theme.muted?.fg || normalFg);

    const innerWidth = width - 2;
    let renderText = displayVal;
    let scrollOffset = 0;
    if (val.length > 0 && this.state.cursorPos > innerWidth - 1) {
      scrollOffset = this.state.cursorPos - innerWidth + 1;
      renderText = val.substring(scrollOffset, scrollOffset + innerWidth);
    } else if (renderText.length > innerWidth) {
      renderText = renderText.substring(0, innerWidth);
    }

    renderer.text(x + 1, y + 1, renderText, textFg, fillBg);

  }

  onKeyDown(e) {
    const val = this.state.value;
    const pos = this.state.cursorPos;

    if (e.key === 'Backspace') {
      if (pos > 0) {
        this.state.value = val.slice(0, pos - 1) + val.slice(pos);
        this.state.cursorPos = pos - 1;
      }
    } else if (e.key === 'Delete') {
      if (pos < val.length) {
        this.state.value = val.slice(0, pos) + val.slice(pos + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (pos > 0) this.state.cursorPos = pos - 1;
    } else if (e.key === 'ArrowRight') {
      if (pos < val.length) this.state.cursorPos = pos + 1;
    } else if (e.key === 'Home') {
      this.state.cursorPos = 0;
    } else if (e.key === 'End') {
      this.state.cursorPos = val.length;
    } else if (e.key.length === 1) {
      this.state.value = val.slice(0, pos) + e.key + val.slice(pos);
      this.state.cursorPos = pos + 1;
    }



    if (this.props.on && this.props.on.change) this.props.on.change(this.state.value);
    if (this.on && this.on.change) this.on.change(this.state.value);
  }
}
