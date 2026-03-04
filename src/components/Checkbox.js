import { Component } from './Component.js';

export class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.props.focusable = true;
        this.state.checked = props.checked || false;
        const label = this.props.label ? String(this.props.label) : '';
        this.width = this.props.width || this.width || (label ? (4 + label.length) : 3);
        this.height = this.props.height || this.height || 1;
    }

    onRender(renderer) {
        const theme = renderer.theme;
        const { fg, bg } = this.getColors(renderer);
        const { x, y } = this.absPosition;
        const bfg = this.state.focused ? (theme.ring?.fg ?? fg) : (theme.border?.fg ?? fg);
        const checkFg = this.state.checked ? (theme.ring?.fg ?? theme.focused?.bg ?? fg) : fg;

        renderer.text(x, y, '[', bfg, bg);
        renderer.text(x + 1, y, this.state.checked ? 'x' : ' ', checkFg, bg);
        renderer.text(x + 2, y, ']', bfg, bg);

        if (this.props.label) {
            const labelFg = this.state.hovered ? fg : (theme.muted?.fg ?? fg);
            renderer.text(x + 4, y, this.props.label, labelFg, bg);
        }
    }

    onClick() { this.toggle(); }
    onKeyDown(e) { if (e.key === ' ' || e.key === 'Enter') this.toggle(); }

    toggle() {
        this.state.checked = !this.state.checked;
        if (this.props.on && this.props.on.change) this.props.on.change(this.state.checked);
        else if (this.on && this.on.change) this.on.change(this.state.checked);
    }
}
