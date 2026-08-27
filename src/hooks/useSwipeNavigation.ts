import { useRef } from "react";
import type React from "react";
import { hasOpenOverlay } from "./useBrowserBackDismiss";

const MINIMUM_SWIPE_DISTANCE = 60;
const MAXIMUM_SWIPE_DURATION_MS = 800;
const HORIZONTAL_DOMINANCE = 1.35;

interface SwipeStart {
  x: number;
  y: number;
  time: number;
}

interface UseSwipeNavigationOptions {
  enabled: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const isInsideHorizontalScroller = (target: Element, boundary: HTMLElement) => {
  let element: HTMLElement | null = target instanceof HTMLElement ? target : target.parentElement;

  while (element && element !== boundary) {
    const overflowX = window.getComputedStyle(element).overflowX;
    if (
      (overflowX === "auto" || overflowX === "scroll") &&
      element.scrollWidth > element.clientWidth + 4
    ) {
      return true;
    }
    element = element.parentElement;
  }

  return false;
};

const shouldIgnoreSwipe = (target: EventTarget | null, boundary: HTMLElement) => {
  if (!(target instanceof Element)) return true;
  if (
    target.closest(
      "input, textarea, select, button, a, form, [role='dialog'], [data-swipe-navigation-ignore], .recharts-wrapper",
    )
  ) {
    return true;
  }

  return isInsideHorizontalScroller(target, boundary);
};

export const useSwipeNavigation = ({
  enabled,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeNavigationOptions) => {
  const swipeStart = useRef<SwipeStart | null>(null);

  const onTouchStart: React.TouchEventHandler<HTMLElement> = (event) => {
    swipeStart.current = null;
    if (!enabled || hasOpenOverlay() || event.touches.length !== 1) return;
    if (shouldIgnoreSwipe(event.target, event.currentTarget)) return;

    const touch = event.touches[0];
    swipeStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const onTouchEnd: React.TouchEventHandler<HTMLElement> = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || hasOpenOverlay() || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const duration = Date.now() - start.time;

    if (
      duration > MAXIMUM_SWIPE_DURATION_MS ||
      Math.abs(deltaX) < MINIMUM_SWIPE_DISTANCE ||
      Math.abs(deltaX) < Math.abs(deltaY) * HORIZONTAL_DOMINANCE
    ) {
      return;
    }

    if (deltaX < 0) onSwipeLeft();
    else onSwipeRight();
  };

  const onTouchCancel = () => {
    swipeStart.current = null;
  };

  return { onTouchStart, onTouchEnd, onTouchCancel };
};
