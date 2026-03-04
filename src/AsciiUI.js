/**
 * ASCII UI — Pure ASCII component library for the web.
 * @module AsciiUI
 */

// Core
import { Engine } from './core/Engine.js';
import { Motion } from './core/Motion.js';
import { defaultTheme } from './core/Theme.js';

// Layout
import { Component } from './components/Component.js';
import { Panel } from './components/Panel.js';
import { ScrollContainer } from './layout/ScrollContainer.js';
import { Divider } from './components/Divider.js';
import { StatusBar } from './components/StatusBar.js';

// Typography & Display
import { Label } from './components/Label.js';
import { Badge } from './components/Badge.js';
import { Breadcrumb } from './components/Breadcrumb.js';

// Buttons & Navigation
import { Button } from './components/Button.js';
import { Link } from './components/Link.js';
import { Tabs } from './components/Tabs.js';
import { Menu } from './components/Menu.js';
import { Pagination } from './components/Pagination.js';
import { Accordion } from './components/Accordion.js';

// Form Controls
import { TextInput } from './components/TextInput.js';
import { Textarea } from './components/Textarea.js';
import { Select } from './components/Select.js';
import { Checkbox } from './components/Checkbox.js';
import { RadioGroup } from './components/RadioGroup.js';
import { Switch } from './components/Switch.js';
import { Slider } from './components/Slider.js';

// Data Display
import { Table } from './components/Table.js';
import { ListView } from './components/ListView.js';
import { Meter } from './components/Meter.js';
import { ProgressBar } from './components/ProgressBar.js';

// Feedback & Overlay
import { Alert } from './components/Alert.js';
import { Toast } from './components/Toast.js';
import { Modal } from './components/Modal.js';
import { Tooltip } from './components/Tooltip.js';
import { Spinner } from './components/Spinner.js';
import { Skeleton } from './components/Skeleton.js';
import { Avatar } from './components/Avatar.js';
import { Placeholder } from './components/Placeholder.js';

export class AsciiUI {
  constructor(containerId, options = {}) {
    this.screen = null;
    this._pendingResize = null;
    const initialTheme = options.theme || defaultTheme;
    this.motion = new Motion(() => {
      if (!this.engine._looping) this.engine.startLoop();
    });
    const onResize = (cols, rows) => {
      if (this.screen) {
        this.screen.cols = cols;
        this.screen.rows = rows;
      } else {
        this._pendingResize = { cols, rows };
      }
    };
    const onTick = (dt) => {
      if (this.motion && this.motion.hasActive()) {
        this.motion.tick(dt);
      } else if (this.engine._looping && !options.continuousRender) {
        this.engine.stopLoop();
      }
    };
    this.engine = new Engine(containerId, { ...options, theme: initialTheme, onResize, onTick });
    this.screen = {
      // Compatibility shim
      rows: this.engine.renderer.rows,
      cols: this.engine.renderer.cols,
      theme: initialTheme,
      preElement: this.engine.renderer.pre
    };
    if (this._pendingResize) {
      this.screen.cols = this._pendingResize.cols;
      this.screen.rows = this._pendingResize.rows;
      this._pendingResize = null;
    }
  }

  add(comp) { this.engine.add(comp); }
  render() { this.engine.scheduleRender(); }
  setTheme(theme) {
    this.screen.theme = theme || defaultTheme;
    if (this.engine.renderer.setTheme) this.engine.renderer.setTheme(this.screen.theme);
    else this.engine.renderer.theme = this.screen.theme;
    this.screen.preElement = this.engine.renderer.pre;
    this.render();
  }

  // Factories
  panel(opts) { return new Panel(opts); }
  button(opts) { return new Button(opts); }
  label(opts) { return new Label(opts); }
  listView(opts) { return new ListView(opts); }
  scrollContainer(opts) { return new ScrollContainer(opts); }

  // Real Implementations
  textInput(opts) { return new TextInput(opts); }
  checkbox(opts) { return new Checkbox(opts); }
  table(opts) { return new Table(opts); }
  tabs(opts) { return new Tabs(opts); }

  divider(opts) { return new Divider(opts); }
  select(opts) { return new Select(opts); }
  radioGroup(opts) { return new RadioGroup(opts); }
  progressBar(opts) { return new ProgressBar(opts); }
  meter(opts) { return new Meter(opts); }
  alert(opts) { return new Alert(opts); }
  badge(opts) { return new Badge(opts); }
  breadcrumb(opts) { return new Breadcrumb(opts); }
  pagination(opts) { return new Pagination(opts); }
  accordion(opts) { return new Accordion(opts); }
  link(opts) { return new Link(opts); }
  spinner(opts) { return new Spinner(opts); }
  skeleton(opts) { return new Skeleton(opts); }
  tooltip(opts) { return new Tooltip(opts); }
  modal(opts) { return new Modal(opts); }
  statusBar(opts) { return new StatusBar(opts); }
  switch(opts) { return new Switch(opts); }
  menu(opts) { return new Menu(opts); }
  toast(opts) { return new Toast(opts); }
  textarea(opts) { return new Textarea(opts); }
  slider(opts) { return new Slider(opts); }
  avatar(opts) { return new Avatar(opts); }
}
