import { useEffect } from "react";

export function useInfiniteScroll(ref, onBottom) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleScroll() {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        onBottom();
      }
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ref, onBottom]);
}
