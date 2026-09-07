import { flushSync } from "react-dom";

export function withViewTransition(callback: () => void, onDone?: () => void) {
  if (typeof document === "undefined" || !document.startViewTransition) {
    callback();
    onDone?.();
    return;
  }
  const transition = document.startViewTransition(() => flushSync(callback));
  if (onDone) transition.finished.finally(onDone);
}