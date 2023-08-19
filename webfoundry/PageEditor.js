import MagicGloves from './MagicGloves.js';

class PageEditor {
  constructor(props) {
    this.props = props;
    d.on('update', () => this.designer.update());
  }

  get designer() { return this.props.designer }
  get backend() { return this.designer.backend }
  get s() { return this.gloves.s }
  set s(x) { this.gloves.s = x }
  update() { d.update() }

  onAttach = () => {
    let global = d.el('script', { type: 'module', src: `/user2/files?site=${this.backend.activeSite}&file=global.js` });
    this.pageRoot.innerHTML = this.backend.activeFileContents;
    this.pageRoot.append(global);
    this.gloves = new MagicGloves(this.pageRoot, this.designer.actions);

    this.mutobs = new MutationObserver(this.onMutate);
    this.mutobs.observe(this.pageRoot, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  };

  onMutate = () => {
    this.backend.activeFileContents = this.pageRoot.innerHTML;
    this.backend.saveFile();
  };

  render = () => this.pageRoot = jsx`
    <div ${{ model: this, onAttach: this.onAttach }}></div>
  `;
}

export default PageEditor;
