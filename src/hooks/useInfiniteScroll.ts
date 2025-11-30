import { RefObject, useEffect } from "react";

export function useInfiniteScroll(
  ref: RefObject<HTMLElement | null>,
  onBottom: () => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        onBottom();
      }
    };

    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [ref, onBottom]);
}
