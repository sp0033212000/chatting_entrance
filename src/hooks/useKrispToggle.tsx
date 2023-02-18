import { useCallback } from "react";

import { LocalAudioTrack } from "twilio-video";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useVideoContext } from "@/src/context/VideoContext";

export function useKrispToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const { setIsKrispEnabled } = useAppStateContext();

  const toggleKrisp = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[
        noiseCancellation.isEnabled ? "disable" : "enable"
      ]().then(() => {
        setIsKrispEnabled(noiseCancellation.isEnabled);
      });
    }
  }, [noiseCancellation, setIsKrispEnabled]);

  return { vendor, toggleKrisp };
}
