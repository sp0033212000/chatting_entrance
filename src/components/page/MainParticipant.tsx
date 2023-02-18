import React from "react";

import useMainParticipant from "@/src/hooks/useMainParticipant";
import useScreenShareParticipant from "@/src/hooks/useScreenShareParticipant";

import { useVideoContext } from "@/src/context/VideoContext";

import useSelectedParticipant from "@/src/context/VideoContext/useSelectedParticipant";

import MainParticipantInfo from "@/src/components/page/MainParticipantInfo";
import ParticipantTracks from "@/src/components/page/ParticipantTracks";

export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant ||
      mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? "high"
      : null;
  console.log(mainParticipant);
  return (
    /* audio is disabled for this participant component because this participant's audio
                             is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant !== localParticipant}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant === localParticipant}
      />
    </MainParticipantInfo>
  );
}
