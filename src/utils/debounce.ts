export default function debounce(fn: () => void, ms: number) {
  let timer: NodeJS.Timeout | null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
