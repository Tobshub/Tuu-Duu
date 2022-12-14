// tbh I don't understand how this works
export default function debounce(fn: () => void, ms: number) {
  let timer: NodeJS.Timeout | null;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      // @ts-ignore
      fn.apply(this, arguments);
    }, ms);
  };
}
