import React, { Suspense, useEffect } from "react";

import { GetServerSideProps } from "next";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { isBrowser } from "react-use/lib/misc/util";

import { pathname } from "@/src/constant";

import { loadingEventEmitter } from "@/src/event";

import { SwaggerAPI } from "@/src/swagger";

import { AppStateContextProvider } from "@/src/context/AppStateContext";
import { useConversationWebsocketContext } from "@/src/context/ConversationWebsocketContext";

import {
  FindConversationEntity,
  JoinConversationEntity,
} from "@/src/swagger/swagger.api";

import { InlineSpinner } from "@/src/components/feature/Spinner";

import OpenGraph from "@/src/components/layout/OpenGraph";

const ConversationRoom = dynamic(
  () => import("@/src/components/page/conversation"),
  { ssr: false }
);

interface Props {
  conversation: FindConversationEntity;
  participate: JoinConversationEntity;
}

const Conversation: React.FC<Props> = ({ conversation, participate }) => {
  const { onConversationJoin, onConversationLeave, onConversationClosed } =
    useConversationWebsocketContext();
  const router = useRouter();

  useEffect(() => {
    onConversationJoin(conversation.id);

    return () => {
      onConversationLeave(conversation.id);
    };
  }, [onConversationJoin, onConversationLeave]);

  useEffect(() => {
    if (!isBrowser) return;
    const listener = () => onConversationLeave(conversation.id);
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [onConversationLeave]);

  useEffect(() => {
    const unsubscribe = onConversationClosed(async () => {
      loadingEventEmitter.emit(true);
      await router.replace(pathname.landingPage).finally(() => {
        loadingEventEmitter.emit(false);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [onConversationClosed]);

  return (
    <AppStateContextProvider
      token={participate.token}
      conversation={conversation}
    >
      <div className={"w-screen bg-gray-700"}>
        <OpenGraph title={conversation.roomName} />
        <Suspense fallback={<InlineSpinner />}>
          <ConversationRoom />
        </Suspense>
      </div>
    </AppStateContextProvider>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  Props,
  { conversationId: string }
> = async ({ params, res, req }) => {
  try {
    const { conversationId } = params ?? {};

    if (!conversationId) throw new Error("Missing conversation id.");

    const { data: conversation } = await SwaggerAPI.conversationApi.findOne(
      conversationId,
      { serverRequest: req, serverResponse: res }
    );
    const { data: participate } =
      await SwaggerAPI.conversationApi.joinConversation(
        {
          conversationId,
        },
        { serverRequest: req, serverResponse: res }
      );

    return {
      props: {
        conversation,
        participate,
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: true,
        destination: pathname.landingPage,
      },
    };
  }
};
