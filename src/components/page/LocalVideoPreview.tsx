import React from "react";

import { LocalVideoTrack } from "twilio-video";

import { makeStyles, Theme, Typography } from "@material-ui/core";

import { useVideoContext } from "@/src/context/VideoContext";

import AvatarIcon from "@/src/components/icons/AvatarIcon";

import LocalAudioLevelIndicator from "@/src/components/page/LocalAudioLevelIndicator";
import VideoTrack from "@/src/components/page/VideoTrack";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: "relative",
    height: 0,
    overflow: "hidden",
    paddingTop: `${(9 / 16) * 100}%`,
    background: "black",
  },
  innerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  identityContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  identity: {
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "0.18em 0.3em",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "black",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      "& svg": {
        transform: "scale(0.7)",
      },
    },
  },
}));

export default function LocalVideoPreview({ identity }: { identity: string }) {
  const classes = useStyles();
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(
    (track) => !track.name.includes("screen") && track.kind === "video"
  ) as LocalVideoTrack;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        {videoTrack ? (
          <VideoTrack track={videoTrack} isLocal />
        ) : (
          <div className={classes.avatarContainer}>
            <AvatarIcon />
          </div>
        )}
      </div>

      <div className={classes.identityContainer}>
        <span className={classes.identity}>
          <LocalAudioLevelIndicator />
          <Typography variant="body1" color="inherit" component="span">
            {identity}
          </Typography>
        </span>
      </div>
    </div>
  );
}
