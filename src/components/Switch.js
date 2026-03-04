import { Component } from './Component.js';

// Modern toggle switch: (  O) off, (O  ) on
// Renders as: [----O] or [O----]
export class Switch extends Component {
    constructor(props) {
        super(props);
        this.props.focusable = true;
        this.state.on = props.on || props.checked || false;
        const label = this.props.label ? String(this.props.label) : '';
        this.width = this.props.width || (label ? (9 + label.length) : 7);
        this.height = 1;
    }

    onRender(renderer) {
        const theme = renderer.theme;
        const { fg, bg } = this.getColors(renderer);
        const { x, y } = this.absPosition;
        const isOn = !!this.state.on;

        const trackW = 5; // inner track width
        const accentFg = theme.ring?.fg ?? theme.focused?.bg ?? fg;
        const mutedFg = theme.muted?.fg ?? theme.border?.fg ?? fg;
        const bfg = this.state.focused ? accentFg : mutedFg;

        // Track: [----O] or [O----]
        let track;
        let knobFg;
        if (isOn) {
            track = '----O';
            knobFg = accentFg;
        } else {
            track = 'O----';
            knobFg = mutedFg;
        }

        renderer.text(x, y, '[', bfg, bg);
        // Render track characters individually for coloring
        for (let i = 0; i < track.length; i++) {
            const ch = track[i];
            const color = ch === 'O' ? knobFg : mutedFg;
            renderer.text(x + 1 + i, y, ch, color, bg);
        }
        renderer.text(x + 1 + trackW, y, ']', bfg, bg);

        // Label
        if (this.props.label) {
            const labelFg = this.state.hovered ? fg : (theme.muted?.fg ?? fg);
            renderer.text(x + trackW + 3, y, this.props.label, labelFg, bg);
        }
    }

    onClick() { this.toggle(); }
    onKeyDown(e) { if (e.key === ' ' || e.key === 'Enter') this.toggle(); }

    toggle() {
        this.state.on = !this.state.on;
        if (this.props.on && typeof this.props.on !== 'boolean' && this.props.on.change) {
            this.props.on.change(this.state.on);
        }
        if (this.on && this.on.change) this.on.change(this.state.on);
    }
}
