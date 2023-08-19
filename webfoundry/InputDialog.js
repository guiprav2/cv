class InputDialog {
  constructor(props) { this.props = props }
  get short() { return d.resolve(this.props.short) }
  get title() { return d.resolve(this.props.title) }
  get value() { return this.props.value }
  get multiline() { return this.props.multiline || this.value?.includes?.('\n') }
  onSubmit = () => this.root.returnValue2 = this.input.value;

  onKeyDown = ev => {
    if ((!this.multiline || ev.ctrlKey) && ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      this.okBtn.click()
    }
  };

  render = () => this.root = jsx`
    <dialog
      ${{ class: [!this.short && 'w-[40vw]', 'p-0 bg-[#262626] rounded text-white text-sm sans'] }}
    >
      <form method="dialog" ${{ onSubmit: this.onSubmit }}>
        ${d.if(() => this.title, jsx`
          <div class="px-3 pt-2 border-b border-neutral-900 pb-1">
            ${d.text(() => this.title)}
          </div>
        `)}
        <div class="p-3">
          ${this.input = !this.multiline ? jsx`
            <input
              class="w-full bg-[#2b2d31] rounded px-2 py-1 outline-none"
              ${{ value: this.value || '', onKeyDown: this.onKeyDown }}
            >
          ` : jsx`
            <textarea
              class="w-full h-32 bg-[#2b2d31] rounded px-2 py-1 outline-none"
              ${{ value: this.value || '', onKeyDown: this.onKeyDown }}
            >
          `}
        </div>
        <div class="flex gap-2 px-3 py-2 border-t border-neutral-900">
          <button class="px-3 py-1 bg-[#2b2d31] rounded flex-1" value="cancel">Cancel</button>
          ${this.okBtn = jsx`<button class="px-3 py-1 bg-[#4f46e5] rounded flex-1" value="ok">OK</button>`}
        </div>
      </form>
    </dialog>
  `;
}

export default InputDialog;
