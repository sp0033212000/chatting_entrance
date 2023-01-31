import React, {
  PropsWithChildren,
  ValidationMap,
  WeakValidationMap,
} from "react";

import { GetServerSidePropsContext } from "next";

export declare global {
  interface Window {}

  type ElementTagName = keyof JSX.IntrinsicElements;

  type ElementPropsWithRef<Tag extends ElementTagName> =
    JSX.IntrinsicElements[Tag];

  type ElementPropsWithoutRef<Tag extends ElementTagName> = Omit<
    ElementPropsWithRef<Tag>,
    "ref"
  >;

  type ElementProps<Tag extends ElementTagName, ExtractProps = {}> = {
    as?: Tag;
    conditional?: boolean;
  } & ElementPropsWithoutRef<Tag> &
    ExtractProps;

  interface FC<P = {}> extends React.FC<PropsWithChildren<P>> {}

  interface CustomizeFunctionComponent<P = {}> {
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  interface CustomizeForwardRefRenderFunction {
    displayName?: string | undefined;
    // explicit rejected with `never` required due to
    // https://github.com/microsoft/TypeScript/issues/36826
    /**
     * defaultProps are not supported on render functions
     */
    defaultProps?: never | undefined;
    /**
     * propTypes are not supported on render functions
     */
    propTypes?: never | undefined;
  }

  interface Option {
    key: string | number;
    label: string;
    active?: boolean;
  }

  interface PageDto<Item extends Record<string, any>> {
    atPage: number;
    items: Item[];
    totalCount: number;
    totalPages: number;
  }
}

declare module "axios" {
  export interface AxiosRequestConfig {
    disableLoader?: boolean;
    disableAlert?: boolean;
    bypassErrorNames?: Array<string>;

    noRedirectAfterAuthFailure?: boolean;
    disableAuth?: boolean;
    token?: string;
    serverRequest?: GetServerSidePropsContext["req"];
    serverResponse?: GetServerSidePropsContext["res"];
  }
}
