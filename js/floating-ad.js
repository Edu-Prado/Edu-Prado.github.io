document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.floating-ad-close');
  const floatingAd = document.querySelector('.floating-ad');
  if (closeBtn && floatingAd) {
    closeBtn.addEventListener('click', () => {
      floatingAd.style.display = 'none';
    });
  }
});
