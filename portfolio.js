let styles = document.createElement('style');

styles.textContent = `
  @keyframes fadeIn {
    0% { opacity: 0 }
    to { opacity: 1 }
  }

  [id^="id"] {
    opacity: 0;
  }

  [id^="id"].scrolledIntoView {
    animation-name: fadeIn;
    animation-delay: 1s;
    animation-duration: 3s;
    animation-fill-mode: both;
  }
`;

document.head.append(styles);

let doc = document.documentElement;
function frame() {
  for (let x of document.querySelectorAll('[id^="id"]')) {
    let rect = x.getBoundingClientRect();
    if (rect.top + rect.height <= doc.scrollTop - innerHeight / 2) {
      x.classList.add('scrolledIntoView');
    }
  }

  requestAnimationFrame(frame);
}

frame();
