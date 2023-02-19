import React, { createContext, PropsWithChildren, useContext } from "react";

import { RemoteParticipant } from "twilio-video";

import useGalleryViewParticipants from "@/src/hooks/useGalleryViewParticipants";
import useSpeakerViewParticipants from "@/src/hooks/useSpeakerViewParticipants";

/**
 * The purpose of the ParticipantProvider component is to ensure that the hooks useGalleryViewParticipants
 * and useSpeakerViewParticipants are not unmounted as users switch between Gallery View and Speaker View.
 * This will make sure that the ordering of the participants on the screen will remain so that the most
 * recent dominant speakers are always at the front of the list.
 */

export interface ParticipantContextStore {
  mobileGalleryViewParticipants: RemoteParticipant[];
  galleryViewParticipants: RemoteParticipant[];
  speakerViewParticipants: RemoteParticipant[];
}

export const ParticipantContext = createContext<ParticipantContextStore>(null!);

export const ParticipantContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const mobileGalleryViewParticipants = useGalleryViewParticipants(true);
  const galleryViewParticipants = useGalleryViewParticipants();
  const speakerViewParticipants = useSpeakerViewParticipants();

  return (
    <ParticipantContext.Provider
      value={{
        mobileGalleryViewParticipants,
        galleryViewParticipants,
        speakerViewParticipants,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};

export function useParticipantContext() {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error(
      "useParticipantContext must be used within the ParticipantContextProvider"
    );
  }
  return context;
}
