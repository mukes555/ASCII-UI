import { Component } from './Component.js';

// Range slider: [===O-------] 30%
export class Slider extends Component {
    constructor(props) {
        super(props);
        this.props.focusable = true;
        this.state.value = props.value ?? 50;
        this.props.min = props.min ?? 0;
        this.props.max = props.max ?? 100;
        this.props.step = props.step ?? 1;
        this.width = props.width || 30;
        this.height = 1;
    }

    onRender(renderer) {
        const theme = renderer.theme;
        const { fg, bg } = this.getColors(renderer);
        const { x, y } = this.absPosition;
        const min = this.props.min;
        const max = this.props.max;
        const val = Math.max(min, Math.min(max, this.state.value));

        const trackW = this.width - 2; // inside [ ]
        const ratio = (val - min) / Math.max(1, max - min);
        const knobPos = Math.round(ratio * (trackW - 1));

        const fillFg = theme.ring?.fg ?? theme.focused?.bg ?? fg;
        const emptyFg = theme.muted?.fg ?? theme.border?.fg ?? fg;
        const bfg = this.state.focused ? fillFg : emptyFg;

        renderer.text(x, y, '[', bfg, bg);
        for (let i = 0; i < trackW; i++) {
            if (i < knobPos) {
                renderer.set(x + 1 + i, y, '=', fillFg, bg);
            } else if (i === knobPos) {
                const knobFg = this.state.hovered || this.state.focused ? fillFg : fg;
                renderer.set(x + 1 + i, y, 'O', knobFg, bg);
            } else {
                renderer.set(x + 1 + i, y, '-', emptyFg, bg);
            }
        }
        renderer.text(x + trackW + 1, y, ']', bfg, bg);

        // Label
        if (this.props.showValue !== false) {
            const label = ` ${val}`;
            renderer.text(x + this.width, y, label, emptyFg, bg);
        }
    }

    onClick(e, gx) {
        const { x } = this.absPosition;
        const trackW = this.width - 2;
        const clickPos = gx - x - 1;
        if (clickPos >= 0 && clickPos < trackW) {
            const ratio = clickPos / (trackW - 1);
            const min = this.props.min;
            const max = this.props.max;
            const step = this.props.step;
            let val = min + ratio * (max - min);
            val = Math.round(val / step) * step;
            this.state.value = Math.max(min, Math.min(max, val));
            this._fire();
        }
    }

    onKeyDown(e) {
        const step = this.props.step;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            this.state.value = Math.min(this.props.max, this.state.value + step);
            this._fire();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            this.state.value = Math.max(this.props.min, this.state.value - step);
            this._fire();
        }
    }

    _fire() {
        if (this.props.on && this.props.on.change) this.props.on.change(this.state.value);
        if (this.on && this.on.change) this.on.change(this.state.value);
    }
}
