document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.floating-ad-close');
  const floatingAd = document.querySelector('.floating-ad');
  const openBtn = document.querySelector('.floating-ad-open');

  if (closeBtn && floatingAd && openBtn) {
    closeBtn.addEventListener('click', () => {
      floatingAd.style.display = 'none';
      openBtn.style.display = 'block';
    });

    openBtn.addEventListener('click', () => {
      floatingAd.style.display = 'block';
      openBtn.style.display = 'none';
    });
  }
});
