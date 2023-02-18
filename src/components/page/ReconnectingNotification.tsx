import React from "react";

import useRoomState from "@/src/hooks/useRoomState";

import Snackbar from "@/src/components/layout/Snackbar";

export default function ReconnectingNotification() {
  const roomState = useRoomState();

  return (
    <Snackbar
      variant="error"
      headline="Connection Lost:"
      message="Reconnecting to room..."
      open={roomState === "reconnecting"}
    />
  );
}
