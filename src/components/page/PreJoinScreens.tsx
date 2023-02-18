import React, { useEffect, useState } from "react";

import { useApplicationContext } from "@/src/context/ApplicationContext";
import { useAppStateContext } from "@/src/context/AppStateContext";
import { useVideoContext } from "@/src/context/VideoContext";

import MediaErrorSnackbar from "@/src/components/feature/MediaErrorSnackbar";

import DeviceSelectionScreen from "@/src/components/page/DeviceSelectionScreen";

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useApplicationContext();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { conversation } = useAppStateContext();

  const [step, setStep] = useState(Steps.roomNameStep);

  const [roomName, setRoomName] = useState<string>("");

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (conversation.roomName) {
      setRoomName(conversation.roomName);
      if (user?.name) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [conversation, user]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch((error) => {
        console.log("Error acquiring local media:");
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  return (
    <React.Fragment>
      <MediaErrorSnackbar error={mediaError} />
      <DeviceSelectionScreen
        name={user?.name ?? ""}
        roomName={roomName}
        setStep={setStep}
      />
    </React.Fragment>
  );
}
