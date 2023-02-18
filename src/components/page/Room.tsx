import React, { useEffect, useRef } from "react";

import clsx from "clsx";
import { Participant, Room as IRoom } from "twilio-video";

import { makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";

import useScreenShareParticipant from "@/src/hooks/useScreenShareParticipant";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useChatContext } from "@/src/context/ChatContext";
import { useVideoContext } from "@/src/context/VideoContext";

import BackgroundSelectionDialog from "@/src/components/feature/BackgroundSelectionDialog";

import ChatWindow from "@/src/components/page/ChatWindow";
import { GalleryView } from "@/src/components/page/GalleryView";
import MainParticipant from "@/src/components/page/MainParticipant";
import { MobileGalleryView } from "@/src/components/page/MobileGalleryView";
import { ParticipantAudioTracks } from "@/src/components/page/ParticipantAudioTracks";
import ParticipantList from "@/src/components/page/ParticipantList";

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${
    theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth
  }px`;
  return {
    container: {
      position: "relative",
      height: "100%",
      display: "grid",
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: "100%",
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: `100%`,
        gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      },
    },
    rightDrawerOpen: {
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px`,
    },
  };
});

/**
 * This hook turns on speaker view when screensharing is active, regardless of if the
 * user was already using speaker view or gallery view. Once screensharing has ended, the user's
 * view will return to whatever they were using prior to screenshare starting.
 */

export function useSetSpeakerViewOnScreenShare(
  screenShareParticipant: Participant | undefined,
  room: IRoom | null,
  setIsGalleryViewActive: React.Dispatch<React.SetStateAction<boolean>>,
  isGalleryViewActive: boolean
) {
  const isGalleryViewActiveRef = useRef(isGalleryViewActive);

  // Save the user's view setting whenever they change to speaker view or gallery view:
  useEffect(() => {
    isGalleryViewActiveRef.current = isGalleryViewActive;
  }, [isGalleryViewActive]);

  useEffect(() => {
    if (
      screenShareParticipant &&
      screenShareParticipant !== room!.localParticipant
    ) {
      // When screensharing starts, save the user's previous view setting (speaker or gallery):
      const prevIsGalleryViewActive = isGalleryViewActiveRef.current;
      // Turn off gallery view so that the user can see the screen that is being shared:
      setIsGalleryViewActive(false);
      return () => {
        // If the user was using gallery view prior to screensharing, turn gallery view back on
        // once screensharing stops:
        if (prevIsGalleryViewActive) {
          setIsGalleryViewActive(prevIsGalleryViewActive);
        }
      };
    }
  }, [screenShareParticipant, setIsGalleryViewActive, room]);
}

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen, room } = useVideoContext();
  const { isGalleryViewActive, setIsGalleryViewActive } = useAppStateContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const screenShareParticipant = useScreenShareParticipant();

  // Here we switch to speaker view when a participant starts sharing their screen, but
  // the user is still free to switch back to gallery view.
  useSetSpeakerViewOnScreenShare(
    screenShareParticipant,
    room,
    setIsGalleryViewActive,
    isGalleryViewActive
  );

  return (
    <div
      className={clsx(classes.container, "pb-[4.5rem] box-content", {
        [classes.rightDrawerOpen]:
          isChatWindowOpen || isBackgroundSelectionOpen,
      })}
    >
      {/*
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}
      <ParticipantAudioTracks />

      {isGalleryViewActive ? (
        isMobile ? (
          <MobileGalleryView />
        ) : (
          <GalleryView />
        )
      ) : (
        <>
          <MainParticipant />
          <ParticipantList />
        </>
      )}

      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
