import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { Participant, Room } from "twilio-video";

import { useAppStateContext } from "@/src/context/AppStateContext";

type selectedParticipantContextType = [
  Participant | null,
  (participant: Participant) => void
];

export const selectedParticipantContext =
  createContext<selectedParticipantContextType>(null!);

export default function useSelectedParticipant() {
  const [selectedParticipant, setSelectedParticipant] = useContext(
    selectedParticipantContext
  );
  return [selectedParticipant, setSelectedParticipant] as const;
}

type SelectedParticipantProviderProps = {
  room: Room | null;
};

export const SelectedParticipantProvider: React.FC<
  PropsWithChildren<SelectedParticipantProviderProps>
> = ({ room, children }) => {
  const { isGalleryViewActive } = useAppStateContext();
  const [selectedParticipant, _setSelectedParticipant] =
    useState<Participant | null>(null);
  const setSelectedParticipant = (participant: Participant) =>
    _setSelectedParticipant((prevParticipant) =>
      prevParticipant === participant ? null : participant
    );

  useEffect(() => {
    if (isGalleryViewActive) {
      _setSelectedParticipant(null);
    }
  }, [isGalleryViewActive]);

  useEffect(() => {
    if (room) {
      const onDisconnect = () => _setSelectedParticipant(null);
      const handleParticipantDisconnected = (participant: Participant) =>
        _setSelectedParticipant((prevParticipant) =>
          prevParticipant === participant ? null : prevParticipant
        );

      room.on("disconnected", onDisconnect);
      room.on("participantDisconnected", handleParticipantDisconnected);
      return () => {
        room.off("disconnected", onDisconnect);
        room.off("participantDisconnected", handleParticipantDisconnected);
      };
    }
  }, [room]);

  return (
    <selectedParticipantContext.Provider
      value={[selectedParticipant, setSelectedParticipant]}
    >
      {children}
    </selectedParticipantContext.Provider>
  );
};
