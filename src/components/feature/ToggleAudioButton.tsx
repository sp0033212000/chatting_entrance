import React from "react";

import Button from "@material-ui/core/Button";

import useLocalAudioToggle from "@/src/hooks/useLocalAudioToggle";

import { useVideoContext } from "@/src/context/VideoContext";

import MicIcon from "@/src/components/icons/MicIcon";
import MicOffIcon from "@/src/components/icons/MicOffIcon";

export default function ToggleAudioButton(props: {
  disabled?: boolean;
  className?: string;
}) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? "No Audio" : isAudioEnabled ? "Mute" : "Unmute"}
    </Button>
  );
}
