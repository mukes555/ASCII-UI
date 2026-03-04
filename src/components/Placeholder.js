import { Component } from './Component.js';

export class Placeholder extends Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || this.width || 12;
    this.height = this.props.height || this.height || 3;
  }

  onRender(renderer) {
    const { fg, bg } = this.getColors(renderer);
    const { x, y } = this.absPosition;

    renderer.box(x, y, this.width, this.height, 'single', fg, bg);
    renderer.text(x + 1, y + 1, this.props.name || 'WIP', fg, bg);
  }
}
