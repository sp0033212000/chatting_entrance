import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
} from "react";

import clsx from "clsx";

interface FlexProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "baseline" | "center" | "start" | "end" | "stretch";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
}

interface FlexboxComponent extends CustomizeForwardRefRenderFunction {
  <Tag extends ElementTagName = "div">(
    props: PropsWithChildren<
      { as?: Tag; conditional?: boolean } & ElementPropsWithRef<Tag> & FlexProps
    >,
    ref: ForwardedRef<HTMLElement>
  ): ReactElement<any, any> | null;
}

const Flexbox: FlexboxComponent = (
  {
    as = "div",
    conditional = true,
    className,
    direction,
    justify,
    align,
    ...props
  },
  ref
) => {
  if (!conditional) return null;

  return React.createElement(as, {
    ...props,
    ref,
    className: clsx(
      className,
      "flex",
      {
        "flex-row": direction === "row",
        "flex-row-reverse": direction === "row-reverse",
        "flex-col": direction === "column",
        "flex-col-reverse": direction === "column-reverse",
      },
      {
        "justify-start": justify === "start",
        "justify-end": justify === "end",
        "justify-center": justify === "center",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
        "justify-evenly": justify === "evenly",
      },
      {
        "items-start": align === "start",
        "items-end": align === "end",
        "items-center": align === "center",
        "items-baseline": align === "baseline",
        "items-stretch": align === "stretch",
      }
    ),
  });
};

export default forwardRef(Flexbox);
