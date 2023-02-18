import React, {
  PropsWithChildren,
  ValidationMap,
  WeakValidationMap,
} from "react";

import { GetServerSidePropsContext } from "next";

import Video, {
  LocalVideoTrack,
  RemoteVideoTrack,
  TwilioError,
} from "twilio-video";

export declare global {
  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }

  interface Window {
    TwilioVideo: Video;
    twilioRoom: Video.Room;
    webkitAudioContext: AudioContext;
  }

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

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = "group" | "group-small" | "peer-to-peer" | "go";

export type RecordingRule = {
  type: "include" | "exclude";
  all?: boolean;
  kind?: "audio" | "video";
  publisher?: string;
};

export type RecordingRules = RecordingRule[];

export type Thumbnail = "none" | "blur" | "image";

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

declare module "twilio-video" {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
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
