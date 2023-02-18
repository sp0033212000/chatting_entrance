import React from "react";

import { Grid, Hidden, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import useParticipants from "@/src/hooks/useParticipants";
import useRoomState from "@/src/hooks/useRoomState";

import { useVideoContext } from "@/src/context/VideoContext";

import ToggleAudioButton from "@/src/components/feature/ToggleAudioButton";

import EndCallButton from "@/src/components/page/EndCallButton";
import ToggleChatButton from "@/src/components/page/ToggleChatButton";
import ToggleVideoButton from "@/src/components/page/ToggleVideoButton";

import Menu from "./Menu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      bottom: 0,
      left: 0,
      right: 0,
      height: `${theme.footerHeight}px`,
      position: "fixed",
      display: "flex",
      padding: "0 1.43em",
      zIndex: 10,
      [theme.breakpoints.down("sm")]: {
        height: `${theme.mobileFooterHeight}px`,
        padding: 0,
      },
    },
    screenShareBanner: {
      position: "fixed",
      zIndex: 8,
      bottom: `${theme.footerHeight}px`,
      left: 0,
      right: 0,
      height: "104px",
      background: "rgba(0, 0, 0, 0.5)",
      "& h6": {
        color: "white",
      },
      "& button": {
        background: "white",
        color: theme.brand,
        border: `2px solid ${theme.brand}`,
        margin: "0 2em",
        "&:hover": {
          color: "#600101",
          border: `2px solid #600101`,
          background: "#FFE9E7",
        },
      },
    },
    hideMobile: {
      display: "initial",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
);

export default function MenuBar() {
  const classes = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === "reconnecting";
  const { room } = useVideoContext();
  const participants = useParticipants();

  return (
    <>
      {isSharingScreen && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classes.screenShareBanner}
        >
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <footer className={`${classes.container}`}>
        <Grid container justifyContent="space-around" alignItems="center">
          {/*@ts-ignore*/}
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Typography variant="body1">
                {room!.name} | {participants.length + 1} participant
                {participants.length ? "s" : ""}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container justifyContent="center">
              <ToggleAudioButton disabled={isReconnecting} />
              <ToggleVideoButton disabled={isReconnecting} />
              <ToggleChatButton />
              {/*@ts-ignore*/}
              <Hidden smDown>
                <Menu />
              </Hidden>
            </Grid>
          </Grid>
          {/*@ts-ignore*/}
          <Hidden smDown>
            <Grid style={{ flex: 1 }}>
              <Grid container justifyContent="flex-end">
                <EndCallButton />
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </footer>
    </>
  );
}
