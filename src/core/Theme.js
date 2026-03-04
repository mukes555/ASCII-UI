export const defaultTheme = {
  name: 'minimal-bw',
  screen: { bg: '#FFFFFF', fg: '#0A0A0A' },
  normal: { fg: '#0A0A0A', bg: '#FFFFFF' },
  focused: { fg: '#FFFFFF', bg: '#0A0A0A' },
  hovered: { fg: '#0A0A0A', bg: '#F2F2F2' },
  disabled: { fg: '#9A9A9A', bg: '#FFFFFF' },
  selected: { fg: '#FFFFFF', bg: '#0A0A0A' },
  surface: { fg: '#0A0A0A', bg: '#FFFFFF' },
  muted: { fg: '#6B7280', bg: '#FFFFFF' },
  ring: { fg: '#0A0A0A' },
  border: { fg: '#0A0A0A' },
  title: { fg: '#0A0A0A', bold: true },
  placeholder: { fg: '#9A9A9A' },
  cursor: { fg: '#FFFFFF', bg: '#0A0A0A' },
  scrollbar: { fg: '#E5E7EB', thumb: '#0A0A0A' },
  modal: { backdrop: { bg: '#F2F2F2' }, border: { fg: '#0A0A0A' } },
  statusBar: { fg: '#0A0A0A', bg: '#FFFFFF' },
  success: '#0A0A0A',
  error: '#0A0A0A',
  warning: '#0A0A0A',
  info: '#0A0A0A',
  borders: { panel: 'single', control: 'single', focus: 'double', modal: 'double' }
};

export class Theme {
  constructor(theme = defaultTheme) {
    this.current = theme;
  }

  set(theme) {
    this.current = theme;
  }

  get() {
    return this.current;
  }
}
