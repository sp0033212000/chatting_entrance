import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";

import { TwilioError } from "twilio-video";

import { StorageProperties } from "@/src/utils";

import { useLocalStorageState } from "@/src/hooks/useLocalStorageState";

import { FindConversationEntity } from "@/src/swagger/swagger.api";

import {
  initialSettings,
  Settings,
  SettingsAction,
  settingsReducer,
} from "./settingsReducer";
import useActiveSinkId from "./useActiveSinkId";

export interface AppStateContextStore {
  conversation: FindConversationEntity;
  error: TwilioError | Error | null;
  activeSinkId: string;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  isGalleryViewActive: boolean;
  setIsGalleryViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  maxGalleryViewParticipants: number;
  setMaxGalleryViewParticipants: React.Dispatch<React.SetStateAction<number>>;
  isKrispEnabled: boolean;
  setIsKrispEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isKrispInstalled: boolean;
  setIsKrispInstalled: React.Dispatch<React.SetStateAction<boolean>>;

  setError(error: TwilioError | Error | null): void;

  getToken(): string;

  setActiveSinkId(sinkId: string): void;
}

const AppStateContext = createContext<AppStateContextStore>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export const AppStateContextProvider: React.FC<
  PropsWithChildren<{ token: string; conversation: FindConversationEntity }>
> = (props) => {
  const [error, setError] = useState<TwilioError | Error | null>(null);
  const [isGalleryViewActive, setIsGalleryViewActive] = useLocalStorageState(
    StorageProperties.IS_GALLERY_VIEW_ACTIVE,
    true
  );
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(
    settingsReducer,
    initialSettings
  );
  const [maxGalleryViewParticipants, setMaxGalleryViewParticipants] =
    useLocalStorageState(StorageProperties.MAX_GALLERY_VIEW_PARTICIPANTS, 6);

  const [isKrispEnabled, setIsKrispEnabled] = useState(false);
  const [isKrispInstalled, setIsKrispInstalled] = useState(false);

  const getToken: AppStateContextStore["getToken"] = useCallback(() => {
    return props.token;
  }, [props.token]);

  return (
    <AppStateContext.Provider
      value={{
        conversation: props.conversation,
        error,
        activeSinkId,
        settings,
        dispatchSetting,
        isGalleryViewActive,
        setIsGalleryViewActive,
        maxGalleryViewParticipants,
        setMaxGalleryViewParticipants,
        isKrispEnabled,
        setIsKrispEnabled,
        isKrispInstalled,
        setIsKrispInstalled,
        setError,
        setActiveSinkId,
        getToken,
      }}
    >
      {props.children}
    </AppStateContext.Provider>
  );
};

export function useAppStateContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error(
      "useAppStateContext must be used within the AppStateContextProvider"
    );
  }
  return context;
}
