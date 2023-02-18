import { useCallback, useState } from "react";

import { LocalVideoTrack } from "twilio-video";

import { useVideoContext } from "@/src/context/VideoContext";

export default function useLocalVideoToggle() {
  const {
    room,
    localTracks,
    getLocalVideoTrack,
    removeLocalVideoTrack,
    onError,
  } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const videoTrack = localTracks.find(
    (track) => !track.name.includes("screen") && track.kind === "video"
  ) as LocalVideoTrack;
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        const localTrackPublication =
          localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit("trackUnpublished", localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIsPublishing(true);
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) =>
            localParticipant?.publishTrack(track, { priority: "low" })
          )
          .catch(onError)
          .finally(() => {
            setIsPublishing(false);
          });
      }
    }
  }, [
    videoTrack,
    localParticipant,
    getLocalVideoTrack,
    isPublishing,
    onError,
    removeLocalVideoTrack,
  ]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
