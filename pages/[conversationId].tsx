import React, { Suspense } from "react";

import { GetServerSideProps } from "next";

import dynamic from "next/dynamic";

import { pathname } from "@/src/constant";

import { SwaggerAPI } from "@/src/swagger";

import { AppStateContextProvider } from "@/src/context/AppStateContext";

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
  return (
    <AppStateContextProvider
      token={participate.token}
      conversation={conversation}
    >
      <div className={"w-screen min-h-screen bg-gray-700"}>
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
