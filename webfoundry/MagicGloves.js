import Boo from 'https://cdn.skypack.dev/boo-overlays';

class MagicGloves {
  constructor(root, actions) {
    Object.assign(this, { root, actions });
    root.addEventListener('click', this.onClick);
    addEventListener('keydown', this.onKeyDown);
    this.sov = new Boo(d.el(MagicOverlay, { s: () => this.s }), () => this.s);
  }

  onClick = ev => {
    if (ev.ctrlKey) { return }
    ev.preventDefault();
    this.s = ev.target;
    d.update();
  };

  onKeyDown = ev => {
    if (ev.key !== 'Escape' && ev.key !== 'v' && document.activeElement.tagName !== 'BODY') { return }
    let handler = this.actions.kbds[ev.key];
    if (!handler) { return }
    ev.preventDefault();
    handler(ev);
  };
}

class MagicOverlay {
  constructor(props) { this.props = props }
  get s() { return d.resolve(this.props.s) }

  render = () => jsx`
    <div class="rounded border border-blue-400 opacity-1 z-10 pointer-events-none transition-all">
      <span class="absolute right-0 bottom-0 -mr-1 -mb-2 rounded-lg px-2 py-0.5 empty:hidden whitespace-nowrap font-2xs text-white bg-blue-400/90">
        <i class="nf nf-md-vector_square"></i>
        ${d.text(() => {
          if (!this.s || this.s.nodeType !== Node.ELEMENT_NODE) { return }
          let txt = this.s.classList[0];
          if (/^[A-Z]/.test(txt)) { return txt }
          return this.s.tagName.toLowerCase();
        })}
      </span>
    </div>
  `;
}

export default MagicGloves;
