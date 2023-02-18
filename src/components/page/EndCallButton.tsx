import React, { useCallback } from "react";

import clsx from "clsx";

import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

import { pathname } from "@/src/constant";

import { SwaggerAPI } from "@/src/swagger";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useVideoContext } from "@/src/context/VideoContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: "white",
      "&:hover": {
        background: "#600101",
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { conversation } = useAppStateContext();
  const router = useRouter();

  const onDisconnect = useCallback(async () => {
    if (!room) return;
    await SwaggerAPI.conversationApi.closeConversation({
      conversationId: conversation.id,
    });
    room.disconnect();
    await router.push(pathname.landingPage);
  }, [room]);

  return (
    <Button
      onClick={onDisconnect}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
