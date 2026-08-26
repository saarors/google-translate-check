const isTranslated =
  document.documentElement.classList.contains('translated-ltr') ||
  document.documentElement.classList.contains('translated-rtl');

console.log(isTranslated);
