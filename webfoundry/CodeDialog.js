class CodeDialog {
  constructor(props) { this.props = props }
  get short() { return d.resolve(this.props.short) }
  get title() { return d.resolve(this.props.title) }
  get value() { return this.props.value }
  get multiline() { return this.props.multiline || this.value?.includes?.('\n') }

  onAttach = () => {
    this.editor = ace.edit(this.editorNode);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.session.setMode('ace/mode/html');
    this.value && this.editor.session.setValue(this.value);
    ace.require("ace/ext/beautify").beautify(this.editor.session);
    this.editor.focus();
  };

  onSubmit = () => this.root.returnValue2 = this.editor.getValue();

  onKeyDown = ev => {
    if ((!this.multiline || ev.ctrlKey) && ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      this.okBtn.click()
    }
  };

  render = () => this.root = jsx`
    <dialog ${{
      class: [!this.short && 'w-[40vw]', 'p-0 bg-[#262626] rounded text-white text-sm sans'],
      onAttach: this.onAttach,
    }}>
      <form method="dialog" ${{ onSubmit: this.onSubmit }}>
        ${d.if(() => this.title, jsx`
          <div class="px-3 pt-2 border-b border-neutral-900 pb-1">
            ${d.text(() => this.title)}
          </div>
        `)}
        <div class="p-3">${this.editorNode = jsx`<div class="h-96 text-base">`}</div>
        <div class="flex gap-2 px-3 py-2 border-t border-neutral-900">
          <button class="px-3 py-1 bg-[#2b2d31] rounded flex-1" value="cancel">Cancel</button>
          ${this.okBtn = jsx`<button class="px-3 py-1 bg-[#4f46e5] rounded flex-1" value="ok">OK</button>`}
        </div>
      </form>
    </dialog>
  `;
}

export default CodeDialog;
