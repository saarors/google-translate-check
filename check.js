(function () {
  const html = document.documentElement;
  const selectors = [
    'iframe.goog-te-banner-frame',
    'iframe.goog-te-menu-frame',
    'iframe.goog-te-balloon-frame',
    '.goog-te-banner-frame',
    '.goog-te-menu-frame',
    '.goog-te-balloon-frame',
    '.goog-te-gadget',
    '[id^="goog-gt-"]',
    '[class*="goog-te-"]'
  ].join(',');

  const originalTexts = new WeakMap();

  function remember(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      if (!originalTexts.has(root)) {
        originalTexts.set(root, root.nodeValue);
      }
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT
    );

    let node;
    while ((node = walker.nextNode())) {
      if (!originalTexts.has(node)) {
        originalTexts.set(node, node.nodeValue);
      }
    }
  }

  function removeGoogleTranslate() {
    document.querySelectorAll(selectors).forEach(el => el.remove());

    const walker = document.createTreeWalker(
      document.documentElement,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    for (const textNode of nodes) {
      const original = originalTexts.get(textNode);

      if (original !== undefined && textNode.nodeValue !== original) {
        textNode.nodeValue = original;
      }
    }

    html.setAttribute('translate', 'no');
    html.classList.remove('translated-ltr', 'translated-rtl');
    document.body?.classList.remove('translated-ltr', 'translated-rtl');

    try {
      document.cookie = 'googtrans=; Max-Age=0; path=/';
      document.cookie = 'googtrans=; Max-Age=0; path=/; domain=' + location.hostname;
    } catch {}
  }

  remember(document.documentElement);

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(selectors)) {
            node.remove();
            continue;
          }

          node.querySelectorAll?.(selectors).forEach(el => el.remove());
          remember(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          remember(node);
        }
      }

      if (mutation.type === 'characterData') {
        const original = originalTexts.get(mutation.target);

        if (original !== undefined && mutation.target.nodeValue !== original) {
          mutation.target.nodeValue = original;
        }
      }
    }

    html.setAttribute('translate', 'no');
    html.classList.remove('translated-ltr', 'translated-rtl');
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  try {
    Object.defineProperty(window, 'google', {
      configurable: true,
      get: () => undefined,
      set: () => {}
    });
  } catch {}

  removeGoogleTranslate();

  window.restoreGoogleTranslate = removeGoogleTranslate;
})();
