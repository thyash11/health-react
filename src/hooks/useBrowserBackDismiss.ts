import { useEffect, useRef } from "react";

const overlayStack: string[] = [];
let nextOverlayId = 0;
let pendingProgrammaticHistoryPops = 0;
let scheduledOverlayPops = 0;
let overlayPopTimer: number | null = null;

const scheduleOverlayHistoryCleanup = () => {
  scheduledOverlayPops += 1;
  if (overlayPopTimer !== null) return;

  overlayPopTimer = window.setTimeout(() => {
    const entriesToRemove = scheduledOverlayPops;
    scheduledOverlayPops = 0;
    overlayPopTimer = null;
    pendingProgrammaticHistoryPops += 1;
    window.history.go(-entriesToRemove);
  }, 0);
};

export const shouldSkipPageBackForOverlay = () => {
  if (pendingProgrammaticHistoryPops > 0) {
    pendingProgrammaticHistoryPops -= 1;
    return true;
  }

  return overlayStack.length > 0;
};

export const hasOpenOverlay = () => overlayStack.length > 0;

export const useBrowserBackDismiss = (open: boolean, onDismiss: () => void) => {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!open) return;

    const overlayId = `nutrimetric-overlay-${++nextOverlayId}`;
    overlayStack.push(overlayId);
    window.history.pushState(
      { ...window.history.state, nutrimetricOverlay: overlayId },
      "",
      window.location.href,
    );

    const handleBrowserBack = () => {
      if (overlayStack[overlayStack.length - 1] !== overlayId) return;
      overlayStack.pop();
      dismissRef.current();
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => {
      window.removeEventListener("popstate", handleBrowserBack);

      const stackIndex = overlayStack.lastIndexOf(overlayId);
      if (stackIndex < 0) return;

      overlayStack.splice(stackIndex, 1);
      scheduleOverlayHistoryCleanup();
    };
  }, [open]);
};
