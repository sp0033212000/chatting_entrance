import React, { useMemo, useState } from "react";

import clsx from "clsx";

import NextImage, { ImageProps } from "next/image";

import { isEmptyString, isSet } from "@/src/utils";

import ConditionalFragment from "@/src/components/common/ConditionalFragment";
import Flexbox from "@/src/components/common/Flexbox";

interface Props extends ImageProps {
  conditional?: boolean;
  imagePlaceholder?: React.ReactElement;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?:
    | "bottom"
    | "center"
    | "left"
    | "left-bottom"
    | "left-top"
    | "right"
    | "right-bottom"
    | "right-top"
    | "top";
}

const Image: React.FC<Props> = ({
  conditional = true,
  className,
  alt,
  imagePlaceholder,
  width,
  height,
  objectFit = "cover",
  objectPosition = "center",
  ...props
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  const shouldPlaceholderShow = useMemo(() => {
    return (
      isSet(imagePlaceholder) &&
      (isError || !isSet(props.src) || isEmptyString(props.src))
    );
  }, [isError, imagePlaceholder, props.src]);

  return (
    <Flexbox
      conditional={conditional}
      justify="center"
      align="center"
      className={clsx(className, "relative overflow-hidden")}
    >
      <ConditionalFragment condition={isSet(width) && isSet(height)}>
        <div
          style={{
            paddingTop: `${
              ((Number(height) ?? 1) / (Number(width) ?? 1)) * 100
            }%`,
          }}
        />
      </ConditionalFragment>
      <Flexbox
        justify={"center"}
        align={"center"}
        className={clsx("w-full h-full", {
          absolute: isSet(width) && isSet(height),
        })}
      >
        {shouldPlaceholderShow ? (
          imagePlaceholder
        ) : (
          <NextImage
            alt={alt}
            onLoad={() => setIsError(false)}
            onError={() => setIsError(true)}
            className={clsx(
              "w-full",
              "h-full",
              {
                "object-contain": objectFit === "contain",
                "object-cover": objectFit === "cover",
                "object-fill": objectFit === "fill",
                "object-none": objectFit === "none",
                "object-scale-down": objectFit === "scale-down",
              },
              {
                "object-bottom": objectPosition === "bottom",
                "object-center": objectPosition === "center",
                "object-left": objectPosition === "left",
                "object-left-bottom": objectPosition === "left-bottom",
                "object-left-top": objectPosition === "left-top",
                "object-right": objectPosition === "right",
                "object-right-bottom": objectPosition === "right-bottom",
                "object-right-top": objectPosition === "right-top",
                "object-top": objectPosition === "top",
              }
            )}
            width={props.layout === "fill" ? undefined : width}
            height={props.layout === "fill" ? undefined : height}
            {...props}
          />
        )}
      </Flexbox>
    </Flexbox>
  );
};

export default Image;
