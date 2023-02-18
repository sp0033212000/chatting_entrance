import { useEffect, useState } from "react";

import { isBrowser } from "react-use/lib/misc/util";

export default function useHeight() {
  const [height, setHeight] = useState<number>(1);

  useEffect(() => {
    if (!isBrowser) return;
    const onResize = () => {
      setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return height + "px";
}
