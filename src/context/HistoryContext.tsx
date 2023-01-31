import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { NOOP } from "@/src/constant";

interface HistoryContextStore {
  history: Array<string>;
  back: (defaultPath?: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextStore>({
  history: [],
  back: NOOP,
});

export const HistoryContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [history, setHistory] = useState<Array<string>>([]);

  const { asPath, ...router } = useRouter();

  useEffect(() => {
    setHistory((prev) => prev.concat(asPath));
  }, [asPath]);

  const back = useCallback(
    async (defaultPath?: string) => {
      if (history.length <= 1 && defaultPath) await router.replace(defaultPath);
      router.back();
    },
    [history]
  );

  return (
    <HistoryContext.Provider value={{ history, back }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => useContext(HistoryContext);
