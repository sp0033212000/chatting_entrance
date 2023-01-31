import { createPortal } from "react-dom";

import { isBrowser } from "react-use/lib/misc/util";

const Portal: FC = ({ children }) => {
  if (!isBrowser) return null;

  return createPortal(children, document.querySelector("#__next")!);
};

export default Portal;
