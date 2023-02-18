import React, { useCallback, useEffect, useState } from "react";

import { GetServerSideProps } from "next";

import clsx from "clsx";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

import { pathname } from "@/src/constant";

import { loadingEventEmitter } from "@/src/event";

import { SwaggerAPI } from "@/src/swagger";

import { isEmptyArray } from "@/src/utils";

import { FindConversationEntity } from "@/src/swagger/swagger.api";

import ConditionalFragment from "@/src/components/common/ConditionalFragment";
import Flexbox from "@/src/components/common/Flexbox";

import Header from "@/src/components/layout/header";
import OpenGraph from "@/src/components/layout/OpenGraph";

interface Props {
  conversations: Array<FindConversationEntity>;
}

const Home: React.FC<Props> = ({ conversations }) => {
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isRouting) return;
    loadingEventEmitter.emit(true);
    return () => {
      loadingEventEmitter.emit(false);
    };
  }, [isRouting]);

  const onCreateClick = useCallback(async () => {
    const { data } = await SwaggerAPI.conversationApi.create();

    setIsRouting(true);
    await router.push(pathname.room(data.id));
    setIsRouting(false);
  }, []);

  return (
    <React.Fragment>
      <OpenGraph />
      <main className={"bg-gray-700 min-h-screen"}>
        <Header />
        <ConditionalFragment condition={isEmptyArray(conversations)}>
          <p className={"px-4 text-orange-700 font-[Orbitron] text-xl"}>
            No conversation created, please create one of your own.
          </p>
        </ConditionalFragment>
        <Flexbox className={"-mr-4 p-6 flex-wrap"}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={clsx(
                "mr-4 mb-4",
                "p-4",
                "w-[calc(25%-16px)]",
                "text-white",
                "border border-white border-solid",
                "rounded-md"
              )}
            >
              <p className={"mb-3 text-xl font-semibold"}>
                {conversation.roomName}
              </p>
              <div className={"mb-3"}>
                <p className={"mb-2"}>Participants：</p>
                <p>
                  {conversation.participants
                    .map((participant) => participant.name)
                    .join("、")}
                </p>
              </div>
              <Link
                href={pathname.room(conversation.id)}
                className={
                  "float-right py-2 px-3 font-medium text-gray-500 rounded-md bg-white"
                }
              >
                JOIN
              </Link>
            </div>
          ))}
        </Flexbox>
        <Flexbox
          as={"button"}
          type={"button"}
          align={"center"}
          justify={"center"}
          onClick={onCreateClick}
          className={
            "fixed bottom-4 right-4 w-12 h-12 bg-white rounded-extreme shadow"
          }
        >
          <FontAwesomeIcon icon={faPlus} className={"w-6 h-6"} />
        </Flexbox>
      </main>
    </React.Fragment>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const { data: participate } = await SwaggerAPI.conversationApi.reJoin({
    serverRequest: req,
    serverResponse: res,
  });

  if (participate) {
    return {
      redirect: {
        statusCode: 301,
        destination: pathname.room(participate.conversationId),
      },
    };
  } else {
    const { data: conversations } = await SwaggerAPI.conversationApi.findAll({
      serverRequest: req,
      serverResponse: res,
    });

    return {
      props: {
        conversations,
      },
    };
  }
};
