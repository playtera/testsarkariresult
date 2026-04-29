'use client';

import { useEffect } from 'react';

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2635309868525139';

export default function AdSenseLoader() {
  useEffect(() => {
    let loaded = false;

    const loadAds = () => {
      if (loaded || document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return;
      loaded = true;

      const script = document.createElement('script');
      script.src = ADSENSE_SRC;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', loadAds);
      window.removeEventListener('keydown', loadAds);
      window.removeEventListener('scroll', loadAds);
      window.removeEventListener('touchstart', loadAds);
    };

    window.addEventListener('pointerdown', loadAds, { passive: true, once: true });
    window.addEventListener('keydown', loadAds, { once: true });
    window.addEventListener('scroll', loadAds, { passive: true, once: true });
    window.addEventListener('touchstart', loadAds, { passive: true, once: true });

    return cleanup;
  }, []);

  return null;
}
