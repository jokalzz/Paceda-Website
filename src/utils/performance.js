// Debounce function untuk optimasi event handlers
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function untuk scroll/resize handlers
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Preload images
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images
export async function preloadImages(srcArray) {
  const promises = srcArray.map((src) => preloadImage(src));
  return Promise.all(promises);
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Check if device is mobile
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Check connection speed
export function getConnectionSpeed() {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.effectiveType) {
      return connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
    }
  }
  return 'unknown';
}

// Should reduce motion based on user preference
export function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Lazy load component helper
export function lazyLoadComponent(importFunc, options = {}) {
  return {
    loader: importFunc,
    loading: options.loading || (() => <div>Loading...</div>),
    error: options.error || (() => <div>Error loading component</div>),
  };
}

// Optimize animation based on device
export function getOptimizedAnimationConfig() {
  const isMobile = isMobileDevice();
  const reducedMotion = shouldReduceMotion();

  if (reducedMotion) {
    return {
      duration: 0.01,
      enabled: false,
    };
  }

  if (isMobile) {
    return {
      duration: 0.2,
      damping: 30,
      stiffness: 400,
    };
  }

  return {
    duration: 0.3,
    damping: 25,
    stiffness: 300,
  };
}
