import React, { useCallback, useRef } from "react";

import Button from "@material-ui/core/Button";

import useDevices from "@/src/hooks/useDevices";
import useLocalVideoToggle from "@/src/hooks/useLocalVideoToggle";

import VideoOffIcon from "@/src/components/icons/VideoOffIcon";
import VideoOnIcon from "@/src/components/icons/VideoOnIcon";

export default function ToggleVideoButton(props: {
  disabled?: boolean;
  className?: string;
}) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={props.className}
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {!hasVideoInputDevices
        ? "No Video"
        : isVideoEnabled
        ? "Stop Video"
        : "Start Video"}
    </Button>
  );
}
