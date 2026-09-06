export function withViewTransition(callback: () => void) {
    if (typeof document === "undefined" || !document.startViewTransition) {
      callback();
      return;
    }
    document.startViewTransition(callback);
  }