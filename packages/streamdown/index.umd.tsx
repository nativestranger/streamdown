import { Streamdown } from './index';
import { injectKatexCSS, isUMDEnvironment } from './lib/css-utils';

// Auto-inject KaTeX CSS in UMD builds
if (isUMDEnvironment()) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectKatexCSS);
  } else {
    injectKatexCSS();
  }
}

// Export for ES modules and CommonJS
export { Streamdown };
export default Streamdown;

// Global assignment for UMD
if (typeof window !== 'undefined') {
  (window as any).Streamdown = Streamdown;
  
  // Also make it available as a React component for convenience
  if (typeof window.React !== 'undefined') {
    (window as any).StreamdownComponent = Streamdown;
  }
}
