import React from "react";

import { Theme } from "@material-ui/core";
import { styled } from "@material-ui/styles";

import useConnectionOptions from "@/src/hooks/useConnectionOptions";
import useHeight from "@/src/hooks/useHeight";
import useRoomState from "@/src/hooks/useRoomState";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { ChatContextProvider } from "@/src/context/ChatContext";
import { ParticipantContextProvider } from "@/src/context/ParticipantContext";
import { VideoContextProvider } from "@/src/context/VideoContext";

import ErrorDialog from "@/src/components/feature/ErrorDialog/ErrorDialog";

import MenuBar from "@/src/components/page/MenuBar";
import MobileTopMenuBar from "@/src/components/page/MobileTopMenuBar";
import PreJoinScreens from "@/src/components/page/PreJoinScreens";
import ReconnectingNotification from "@/src/components/page/ReconnectingNotification";
import RecordingNotifications from "@/src/components/page/RecordingNotifications";

import Room from "./Room";

const Conversation = () => {
  const { error, setError } = useAppStateContext();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoContextProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ParticipantContextProvider>
        <ChatContextProvider>
          <ConversationApp />
        </ChatContextProvider>
      </ParticipantContextProvider>
    </VideoContextProvider>
  );
};

export default Conversation;

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  overflow: "hidden",
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: "black",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

const ConversationApp = () => {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <div style={{ height }}>
      {roomState === "disconnected" ? (
        <PreJoinScreens />
      ) : (
        <Main className={"max-h-full h-full pb-[4.5rem] overflow-hidden"}>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
        </Main>
      )}
    </div>
  );
};
