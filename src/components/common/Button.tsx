import React, { forwardRef, PropsWithChildren } from "react";

import clsx from "clsx";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type ButtonType = "pink" | "pink-light" | "red";

interface Props extends ElementPropsWithRef<"button"> {
  buttonType: ButtonType;
  disableSize?: boolean;
  disableRadius?: boolean;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  (
    {
      children,
      disableSize,
      disableRadius,
      buttonType,
      className,
      type = "button",
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          className,
          !disableSize && "py-3 px-9",
          "text-base font-bold",
          { "rounded-extreme": !disableRadius },
          buttonType === "pink" &&
            "text-white bg-pink-button active:opacity-80 disabled:opacity-30",
          buttonType === "red" &&
            "text-white bg-red active:opacity-80 disabled:opacity-30",
          buttonType === "pink-light" &&
            "text-pink bg-pink-bg-light active:bg-opacity-60 disabled:opacity-40"
        )}
        ref={ref}
        type={type}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

export default Button;

export const FontAwesomeButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: IconProp;
  className?: string;
}> = ({ onClick, icon, className }) => (
  <Button
    disableSize
    buttonType={"pink-light"}
    className={clsx(className, "w-8 h-8")}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </Button>
);
