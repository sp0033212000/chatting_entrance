import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  ConnectOptions,
  CreateLocalTrackOptions,
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
} from "twilio-video";

import { BackgroundSettings, ErrorCallback } from "@/types/global";

import AttachVisibilityHandler from "./AttachVisibilityHandler";
import useBackgroundSettings from "./useBackgroundSettings";
import useHandleRoomDisconnection from "./useHandleRoomDisconnection";
import useHandleTrackPublicationFailed from "./useHandleTrackPublicationFailed";
import useLocalTracks from "./useLocalTracks";
import useRestartAudioTrackOnDeviceChange from "./useRestartAudioTrackOnDeviceChange";
import useRoom from "./useRoom";
import useScreenShareToggle from "./useScreenShareToggle";
import { SelectedParticipantProvider } from "./useSelectedParticipant";

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

export interface VideoContextStore {
  room: Room | null;
  localTracks: (LocalAudioTrack | LocalVideoTrack)[];
  isConnecting: boolean;
  connect: (token: string) => Promise<void>;
  onError: ErrorCallback;
  getLocalVideoTrack: (
    newOptions?: CreateLocalTrackOptions
  ) => Promise<LocalVideoTrack>;
  isAcquiringLocalTracks: boolean;
  removeLocalVideoTrack: () => void;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
  getAudioAndVideoTracks: () => Promise<void>;
  isBackgroundSelectionOpen: boolean;
  setIsBackgroundSelectionOpen: (value: boolean) => void;
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: BackgroundSettings) => void;
}

export const VideoContext = createContext<VideoContextStore>(null!);

interface VideoProviderProps {
  options?: ConnectOptions;
  onError: ErrorCallback;
}

export const VideoContextProvider: React.FC<
  PropsWithChildren<VideoProviderProps>
> = ({ options, children, onError = () => {} }) => {
  const onErrorCallback: ErrorCallback = useCallback(
    (error) => {
      console.log(`ERROR:::: ${error.message}`, error);
      onError(error);
    },
    [onError]
  );

  const {
    localTracks,
    getLocalVideoTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  } = useLocalTracks();
  const { room, isConnecting, connect } = useRoom(
    localTracks,
    onErrorCallback,
    options
  );

  const [isSharingScreen, toggleScreenShare] = useScreenShareToggle(
    room,
    onError
  );

  // Register callback functions to be called on room disconnect.
  useHandleRoomDisconnection(
    room,
    onError,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    isSharingScreen,
    toggleScreenShare
  );
  useHandleTrackPublicationFailed(room, onError);
  useRestartAudioTrackOnDeviceChange(localTracks);

  const [isBackgroundSelectionOpen, setIsBackgroundSelectionOpen] =
    useState(false);
  const videoTrack = localTracks.find(
    (track) => !track.name.includes("screen") && track.kind === "video"
  ) as LocalVideoTrack | undefined;
  const [backgroundSettings, setBackgroundSettings] = useBackgroundSettings(
    videoTrack,
    room
  );

  return (
    <VideoContext.Provider
      value={{
        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        getLocalVideoTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare,
        getAudioAndVideoTracks,
        isBackgroundSelectionOpen,
        setIsBackgroundSelectionOpen,
        backgroundSettings,
        setBackgroundSettings,
      }}
    >
      <SelectedParticipantProvider room={room}>
        {children}
      </SelectedParticipantProvider>
      {/*
        The AttachVisibilityHandler  component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
};

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error(
      "useVideoContext must be used within a VideoContextProvider"
    );
  }
  return context;
}
