import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Client } from "@twilio/conversations";
import { Conversation, Message } from "@twilio/conversations/";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useVideoContext } from "@/src/context/VideoContext";

type ChatContextStore = {
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  connect: (token: string) => void;
  hasUnreadMessages: boolean;
  messages: Message[];
  conversation: Conversation | null;
};

export const ChatContext = createContext<ChatContextStore>(null!);

export const ChatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { room, onError } = useVideoContext();

  const isChatWindowOpenRef = useRef(false);

  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatClient, setChatClient] = useState<Client>();

  const { conversation: conversationInfo } = useAppStateContext();

  const connect = useCallback(
    (token: string) => {
      const client = new Client(token);

      const handleClientInitialized = (state: string) => {
        if (state === "initialized") {
          // @ts-ignore
          window.chatClient = client;
          setChatClient(client);
        } else if (state === "failed") {
          onError(
            new Error(
              "There was a problem connecting to Twilio's conversation service."
            )
          );
        }
      };

      client.on("stateChanged", handleClientInitialized);

      return () => {
        client.off("stateChanged", handleClientInitialized);
      };
    },
    [onError]
  );

  useEffect(() => {
    if (conversation) {
      const handleMessageAdded = (message: Message) =>
        setMessages((oldMessages) => [...oldMessages, message]);
      conversation
        .getMessages()
        .then((newMessages) => setMessages(newMessages.items));
      conversation.on("messageAdded", handleMessageAdded);
      return () => {
        conversation.off("messageAdded", handleMessageAdded);
      };
    }
  }, [conversation]);

  useEffect(() => {
    // If the chat window is closed and there are new messages, set hasUnreadMessages to true
    if (!isChatWindowOpenRef.current && messages.length) {
      setHasUnreadMessages(true);
    }
  }, [messages]);

  useEffect(() => {
    isChatWindowOpenRef.current = isChatWindowOpen;
    if (isChatWindowOpen) setHasUnreadMessages(false);
  }, [isChatWindowOpen]);

  useEffect(() => {
    if (room && chatClient) {
      // console.log(room);
      chatClient
        .getConversationByUniqueName(conversationInfo!.uniqueName)
        .then((newConversation) => {
          //@ts-ignore
          window.chatConversation = newConversation;
          setConversation(newConversation);
        })
        .catch((e) => {
          console.error(e);
          onError(
            new Error(
              "There was a problem getting the Conversation associated with this room."
            )
          );
        });
    }
  }, [room, chatClient, onError]);

  return (
    <ChatContext.Provider
      value={{
        isChatWindowOpen,
        setIsChatWindowOpen,
        connect,
        hasUnreadMessages,
        messages,
        conversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within the AppStateProvider");
  }
  return context;
}
