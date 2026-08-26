function getTranslationStatus() {
  const html = document.documentElement;
  const body = document.body;
  const signals = [];
  let score = 0;

  const add = (name, points) => {
    signals.push(name);
    score += points;
  };

  if (
    html.classList.contains('translated-ltr') ||
    html.classList.contains('translated-rtl')
  ) add('google-html-class', 100);

  if (document.querySelector(
    'iframe.goog-te-banner-frame, iframe.goog-te-menu-frame, iframe.goog-te-balloon-frame'
  )) add('google-iframe', 100);

  if (document.querySelector(
    '.goog-te-banner-frame, .goog-te-gadget, .goog-te-balloon-frame'
  )) add('google-element', 90);

  if (document.querySelector(
    '[id^="goog-gt-"], [class*="goog-te-"]'
  )) add('google-dom', 80);

  if (document.querySelector(
    'script[src*="translate.google"], script[src*="translate.googleapis"]'
  )) add('google-script', 60);

  if (window.google?.translate) add('google-api', 80);

  if (/googtrans/i.test(document.cookie)) add('google-cookie', 90);

  if (document.querySelector(
    '[id*="microsoft-translator"], [class*="microsoft-translator"]'
  )) add('microsoft-dom', 80);

  if (document.querySelector(
    'script[src*="microsofttranslator"], script[src*="translator.microsoft"]'
  )) add('microsoft-script', 60);

  if (
    window.MicrosoftTranslator ||
    window.MicrosoftTranslatorWidget
  ) add('microsoft-api', 80);

  if (document.querySelector(
    'iframe[src*="translate"], iframe[src*="translator"]'
  )) add('translation-iframe', 70);

  if (document.querySelector(
    'script[src*="translate"], script[src*="translator"]'
  )) add('translation-script', 50);

  if (html.hasAttribute('translate'))
    add(`html-translate-${html.getAttribute('translate')}`, 10);

  if (body?.hasAttribute('translate'))
    add(`body-translate-${body.getAttribute('translate')}`, 10);

  const lang = html.getAttribute('lang');

  return {
    translated: score >= 50,
    confidence:
      score >= 100 ? 'high' :
      score >= 50 ? 'medium' :
      'low',
    score,
    language: lang || null,
    signals
  };
}

function disableTranslation() {
  const html = document.documentElement;

  html.setAttribute('translate', 'no');
  html.setAttribute('lang', html.getAttribute('data-original-lang') || 'en');

  html.classList.remove(
    'translated-ltr',
    'translated-rtl'
  );

  document.querySelectorAll(
    '.goog-te-banner-frame, .goog-te-menu-frame, .goog-te-balloon-frame, .goog-te-gadget'
  ).forEach(el => el.remove());

  document.querySelectorAll(
    'iframe.goog-te-banner-frame, iframe.goog-te-menu-frame, iframe.goog-te-balloon-frame'
  ).forEach(el => el.remove());

  document.querySelectorAll(
    '[id^="goog-gt-"], [class*="goog-te-"]'
  ).forEach(el => {
    if (
      el.id?.startsWith('goog-gt-') ||
      [...el.classList].some(c => c.includes('goog-te-'))
    ) {
      el.remove();
    }
  });

  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + location.hostname;

  try {
    sessionStorage.removeItem('googtrans');
    localStorage.removeItem('googtrans');
  } catch {}

  window.location.reload();
}

if (!document.documentElement.hasAttribute('data-original-lang')) {
  document.documentElement.setAttribute(
    'data-original-lang',
    document.documentElement.getAttribute('lang') || 'en'
  );
}

console.log(getTranslationStatus());
