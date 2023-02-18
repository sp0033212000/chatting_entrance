import { useCallback, useState } from "react";

import Video, {
  CreateLocalTrackOptions,
  LocalAudioTrack,
  LocalVideoTrack,
  NoiseCancellationOptions,
} from "twilio-video";

import { DEFAULT_VIDEO_CONSTRAINTS } from "@/src/constants";

import {
  getDeviceInfo,
  isPermissionDenied,
  storage,
  StorageProperties,
} from "@/src/utils";

import { useAppStateContext } from "@/src/context/AppStateContext";

const noiseCancellationOptions: NoiseCancellationOptions = {
  sdkAssetsPath: "/noisecancellation",
  vendor: "krisp",
};

export default function useLocalTracks() {
  const { setIsKrispEnabled, setIsKrispInstalled } = useAppStateContext();
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const getLocalVideoTrack = useCallback(async () => {
    const selectedVideoDeviceId = storage.getter(
      StorageProperties.SELECTED_VIDEO_INPUT_KEY
    );

    const { videoInputDevices } = await getDeviceInfo();

    const hasSelectedVideoDevice = videoInputDevices.some(
      (device) =>
        selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...(hasSelectedVideoDevice && {
        deviceId: { exact: selectedVideoDeviceId! },
      }),
    };

    return Video.createLocalVideoTrack(options).then((newTrack) => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, []);

  const removeLocalAudioTrack = useCallback(() => {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(undefined);
    }
  }, [audioTrack]);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  const getAudioAndVideoTracks = useCallback(async () => {
    const {
      audioInputDevices,
      videoInputDevices,
      hasAudioInputDevices,
      hasVideoInputDevices,
    } = await getDeviceInfo();

    if (!hasAudioInputDevices && !hasVideoInputDevices)
      return Promise.resolve();
    if (isAcquiringLocalTracks || audioTrack || videoTrack)
      return Promise.resolve();

    setIsAcquiringLocalTracks(true);

    const selectedAudioDeviceId = storage.getter(
      StorageProperties.SELECTED_AUDIO_INPUT_KEY
    );
    const selectedVideoDeviceId = storage.getter(
      StorageProperties.SELECTED_VIDEO_INPUT_KEY
    );

    const hasSelectedAudioDevice = audioInputDevices.some(
      (device) =>
        selectedAudioDeviceId && device.deviceId === selectedAudioDeviceId
    );
    const hasSelectedVideoDevice = videoInputDevices.some(
      (device) =>
        selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    // In Chrome, it is possible to deny permissions to only audio or only video.
    // If that has happened, then we don't want to attempt to acquire the device.
    const isCameraPermissionDenied = await isPermissionDenied("camera");
    const isMicrophonePermissionDenied = await isPermissionDenied("microphone");

    const shouldAcquireVideo =
      hasVideoInputDevices && !isCameraPermissionDenied;
    const shouldAcquireAudio =
      hasAudioInputDevices && !isMicrophonePermissionDenied;

    const localTrackConstraints = {
      video: shouldAcquireVideo && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && {
          deviceId: { exact: selectedVideoDeviceId! },
        }),
      },
      audio: shouldAcquireAudio && {
        noiseCancellationOptions,
        ...(hasSelectedAudioDevice && {
          deviceId: { exact: selectedAudioDeviceId! },
        }),
      },
    };

    return Video.createLocalTracks(localTrackConstraints)
      .then((tracks) => {
        const newVideoTrack = tracks.find(
          (track) => track.kind === "video"
        ) as LocalVideoTrack;
        const newAudioTrack = tracks.find(
          (track) => track.kind === "audio"
        ) as LocalAudioTrack;
        if (newVideoTrack) {
          setVideoTrack(newVideoTrack);
          // Save the deviceId so it can be picked up by the VideoInputList component. This only matters
          // in cases where the user's video is disabled.
          storage.setter(
            StorageProperties.SELECTED_VIDEO_INPUT_KEY,
            newVideoTrack.mediaStreamTrack.getSettings().deviceId ?? ""
          );
        }
        if (newAudioTrack) {
          setAudioTrack(newAudioTrack);
          if (newAudioTrack.noiseCancellation) {
            setIsKrispEnabled(true);
            setIsKrispInstalled(true);
          }
        }

        // These custom errors will be picked up by the MediaErrorSnackbar component.
        if (isCameraPermissionDenied && isMicrophonePermissionDenied) {
          const error = new Error();
          error.name = "NotAllowedError";
          throw error;
        }

        if (isCameraPermissionDenied) {
          throw new Error("CameraPermissionsDenied");
        }

        if (isMicrophonePermissionDenied) {
          throw new Error("MicrophonePermissionsDenied");
        }
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [
    audioTrack,
    videoTrack,
    isAcquiringLocalTracks,
    setIsKrispEnabled,
    setIsKrispInstalled,
  ]);

  const localTracks = [audioTrack, videoTrack].filter(
    (track) => track !== undefined
  ) as (LocalAudioTrack | LocalVideoTrack)[];

  return {
    localTracks,
    getLocalVideoTrack,
    isAcquiringLocalTracks,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  };
}
