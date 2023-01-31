import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ApplicationContextProvider } from "@/src/context/ApplicationContext";
import { HistoryContextProvider } from "@/src/context/HistoryContext";

import Spinner from "@/src/components/feature/Spinner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApplicationContextProvider>
      <HistoryContextProvider>
        <Spinner />
        <Component {...pageProps} />
      </HistoryContextProvider>
    </ApplicationContextProvider>
  );
}
