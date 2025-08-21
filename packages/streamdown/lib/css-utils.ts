/**
 * Utility to inject KaTeX CSS for UMD builds
 * This ensures math rendering works properly in browser environments
 */
export const injectKatexCSS = (): void => {
  if (typeof document === 'undefined') return;
  
  // Check if KaTeX CSS is already loaded
  if (document.querySelector('#katex-css') || document.querySelector('link[href*="katex"]')) {
    return;
  }

  const link = document.createElement('link');
  link.id = 'katex-css';
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css';
  link.crossOrigin = 'anonymous';
  
  // Add error handling
  link.onerror = () => {
    console.warn('Failed to load KaTeX CSS. Math rendering may not work properly.');
  };
  
  document.head.appendChild(link);
};

/**
 * Check if we're running in a UMD environment
 */
export const isUMDEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.React !== 'undefined' && 
         typeof module === 'undefined';
};
