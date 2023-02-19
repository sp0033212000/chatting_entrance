import React, { useEffect } from "react";

import {
  Button,
  Grid,
  Hidden,
  makeStyles,
  Switch,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useRouter } from "next/router";

import { pathname } from "@/src/constant";

import { loadingEventEmitter } from "@/src/event";

import { SwaggerAPI } from "@/src/swagger";

import { useKrispToggle } from "@/src/hooks/useKrispToggle";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useChatContext } from "@/src/context/ChatContext";
import { useVideoContext } from "@/src/context/VideoContext";

import InfoIconOutlined from "@/src/components/icons/InfoIconOutlined";
import SmallCheckIcon from "@/src/components/icons/SmallCheckIcon";

import Flexbox from "@/src/components/common/Flexbox";

import ToggleAudioButton from "@/src/components/feature/ToggleAudioButton";

import Header from "@/src/components/layout/header";

import LocalVideoPreview from "@/src/components/page/LocalVideoPreview";
import { Steps } from "@/src/components/page/PreJoinScreens";
import SettingsMenu from "@/src/components/page/SettingsMenu";
import ToggleVideoButton from "@/src/components/page/ToggleVideoButton";

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: "1em",
  },
  marginTop: {
    marginTop: "1em",
  },
  deviceButton: {
    width: "100%",
    border: "2px solid #aaa",
    margin: "1em 0",
  },
  localPreviewContainer: {
    paddingRight: "2em",
    marginBottom: "2em",
    [theme.breakpoints.down("sm")]: {
      padding: "0 2.5em",
    },
  },
  joinButtons: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      width: "100%",
      "& button": {
        margin: "0.5em 0",
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-between",
      margin: "1.5em 0 1em",
    },
  },
  mobileButton: {
    padding: "0.8em 0",
    margin: 0,
  },
  toolTipContainer: {
    display: "flex",
    alignItems: "center",
    "& div": {
      display: "flex",
      alignItems: "center",
    },
    "& svg": {
      marginLeft: "0.3em",
    },
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({
  name,
  roomName,
  setStep,
}: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const router = useRouter();
  const { getToken, isKrispEnabled, isKrispInstalled, conversation } =
    useAppStateContext();
  const { connect: chatConnect } = useChatContext();
  const {
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
  } = useVideoContext();
  const { toggleKrisp } = useKrispToggle();
  const disableButtons = isAcquiringLocalTracks || isConnecting;

  const handleJoin = () => {
    const token = getToken();
    videoConnect(token);
    chatConnect(token);
  };

  const handleCancel = async () => {
    setStep(Steps.roomNameStep);
    await SwaggerAPI.conversationApi.closeConversation({
      conversationId: conversation.id,
    });
    await router.replace(pathname.landingPage);
  };

  useEffect(() => {
    if (!isConnecting) return;
    loadingEventEmitter.emit(true);

    return () => {
      loadingEventEmitter.emit(false);
    };
  }, [isConnecting]);

  if (isConnecting) return null;

  return (
    <React.Fragment>
      <Header />
      <div className={"p-6"}>
        <div className={"p-12 bg-white rounded-xl"}>
          <Typography
            variant="h5"
            className={`${classes.gutterBottom} text-white`}
          >
            Join {roomName}
          </Typography>

          <Grid container justifyContent="center">
            <Grid item md={7} sm={12} xs={12}>
              <div className={classes.localPreviewContainer}>
                <LocalVideoPreview identity={name} />
              </div>
              <div className={classes.mobileButtonBar}>
                {/*@ts-ignore*/}
                <Hidden mdUp>
                  <ToggleAudioButton
                    className={classes.mobileButton}
                    disabled={disableButtons}
                  />
                  <ToggleVideoButton
                    className={classes.mobileButton}
                    disabled={disableButtons}
                  />
                  <SettingsMenu mobileButtonClass={classes.mobileButton} />
                </Hidden>
              </div>
            </Grid>
            <Grid item md={5} sm={12} xs={12}>
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                style={{ alignItems: "normal" }}
              >
                <div>
                  {/*@ts-ignore*/}
                  <Hidden smDown>
                    <ToggleAudioButton
                      className={classes.deviceButton}
                      disabled={disableButtons}
                    />
                    <ToggleVideoButton
                      className={classes.deviceButton}
                      disabled={disableButtons}
                    />
                  </Hidden>
                </div>
              </Grid>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              {isKrispInstalled && (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ marginBottom: "1em" }}
                >
                  <div className={classes.toolTipContainer}>
                    <Typography variant="subtitle2">
                      Noise Cancellation
                    </Typography>
                    <Tooltip
                      title="Suppress background noise from your microphone"
                      interactive
                      leaveDelay={250}
                      leaveTouchDelay={15000}
                      enterTouchDelay={0}
                    >
                      <div>
                        <InfoIconOutlined />
                      </div>
                    </Tooltip>
                  </div>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!isKrispEnabled}
                        checkedIcon={<SmallCheckIcon />}
                        disableRipple={true}
                        onClick={toggleKrisp}
                      />
                    }
                    label={isKrispEnabled ? "Enabled" : "Disabled"}
                    style={{ marginRight: 0 }}
                    // Prevents <Switch /> from being temporarily enabled (and then quickly disabled) in unsupported browsers after
                    // isAcquiringLocalTracks becomes false:
                    disabled={isKrispEnabled && isAcquiringLocalTracks}
                  />
                </Grid>
              )}
              <Divider />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Grid
                container
                direction="row"
                alignItems="center"
                style={{ marginTop: "1em" }}
              >
                <Grid item md={12} sm={12} xs={12}>
                  <Flexbox justify={"end"}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                      style={{ marginRight: "16px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      data-cy-join-now
                      onClick={handleJoin}
                      disabled={disableButtons}
                    >
                      Join Now
                    </Button>
                  </Flexbox>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
}
