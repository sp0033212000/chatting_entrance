import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { useAsync } from "react-use";

import * as io from "socket.io-client";

import { NOOP } from "@/src/constant";

import { SwaggerAPI } from "@/src/swagger";

import { FindConversationEntity } from "@/src/swagger/swagger.api";

interface ConversationWebsocketContextStore {
  socket: io.Socket | null;
  onConversationCreated: (
    listener: (data: FindConversationEntity) => void
  ) => () => void;
  onConversationUpdated: (
    listener: (data: FindConversationEntity) => void
  ) => () => void;
  onConversationClosed: (
    listener: (data: { conversationId: string }) => void
  ) => () => void;
  onConversationJoin: (conversationId: string) => void;
  onConversationLeave: (conversationId: string) => void;
}

const ConversationWebsocketContext =
  createContext<ConversationWebsocketContextStore>({
    socket: null,
    onConversationCreated: NOOP,
    onConversationUpdated: NOOP,
    onConversationClosed: NOOP,
    onConversationJoin: NOOP,
    onConversationLeave: NOOP,
  });

export const ConversationWebsocketContextProvider: React.FC<
  PropsWithChildren
> = ({ children }) => {
  const { value: socket = null } = useAsync(async () => {
    const { data } = await SwaggerAPI.conversationApi.getSocketUrl();

    return io.connect(data.url) as io.Socket;
  }, []);

  const onConversationCreated = useCallback<
    ConversationWebsocketContextStore["onConversationCreated"]
  >(
    (listener) => {
      if (!socket) return NOOP;
      socket.on("created", listener);
      return () => socket.off("created", listener);
    },
    [socket]
  );

  const onConversationUpdated = useCallback<
    ConversationWebsocketContextStore["onConversationUpdated"]
  >(
    (listener) => {
      if (!socket) return NOOP;
      socket.on("updated", listener);
      return () => socket.off("updated", listener);
    },
    [socket]
  );

  const onConversationClosed = useCallback<
    ConversationWebsocketContextStore["onConversationClosed"]
  >(
    (listener) => {
      if (!socket) return NOOP;
      socket.on("closed", listener);
      return () => socket.off("closed", listener);
    },
    [socket]
  );

  const onConversationJoin = useCallback<
    ConversationWebsocketContextStore["onConversationJoin"]
  >(
    (conversationId) => {
      if (!socket) return;
      socket.emit("join", { conversationId });
    },
    [socket]
  );

  const onConversationLeave = useCallback<
    ConversationWebsocketContextStore["onConversationLeave"]
  >(
    (conversationId) => {
      if (!socket) return;
      socket.emit("leave", { conversationId });
    },
    [socket]
  );

  return (
    <ConversationWebsocketContext.Provider
      value={{
        socket,
        onConversationCreated,
        onConversationUpdated,
        onConversationClosed,
        onConversationJoin,
        onConversationLeave,
      }}
    >
      {children}
    </ConversationWebsocketContext.Provider>
  );
};

export function useConversationWebsocketContext() {
  const context = useContext(ConversationWebsocketContext);
  if (!context) {
    throw new Error(
      "useConversationWebsocketContext must be used within the ConversationWebsocketContextProvider"
    );
  }
  return context;
}
