import { RemoteAudioTrack, RemoteParticipant } from "twilio-video";

import useParticipants from "@/src/hooks/useParticipants";

import AudioTrack from "@/src/components/page/AudioTrack";
import useTracks from "@/src/components/page/useTracks";

function Participant({ participant }: { participant: RemoteParticipant }) {
  const tracks = useTracks(participant);
  const audioTrack = tracks.find((track) => track.kind === "audio") as
    | RemoteAudioTrack
    | undefined;

  if (audioTrack?.kind === "audio") return <AudioTrack track={audioTrack} />;

  return null;
}

/*
  This ParticipantAudioTracks component will render the audio track for all participants in the room.
  It is in a separate component so that the audio tracks will always be rendered, and that they will never be
  unnecessarily unmounted/mounted as the user switches between Gallery View and Speaker View.
*/
export function ParticipantAudioTracks() {
  const participants = useParticipants();

  return (
    <>
      {participants.map((participant) => (
        <Participant key={participant.sid} participant={participant} />
      ))}
    </>
  );
}
