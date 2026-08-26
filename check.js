(function () {
  const html = document.documentElement;

  html.setAttribute('translate', 'no');

  const meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  document.head.appendChild(meta);

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
  ];

  function disableTranslation() {
    document.documentElement.setAttribute('translate', 'no');

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    document.documentElement.classList.remove(
      'translated-ltr',
      'translated-rtl'
    );

    document.body?.classList.remove(
      'translated-ltr',
      'translated-rtl'
    );
  }

  disableTranslation();

  new MutationObserver(disableTranslation).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
