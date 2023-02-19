import "@/styles/globals.css";
import NextNProgress from "nextjs-progressbar";

import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import type { AppProps } from "next/app";

import { ApplicationContextProvider } from "@/src/context/ApplicationContext";
import { ConversationWebsocketContextProvider } from "@/src/context/ConversationWebsocketContext";
import { HistoryContextProvider } from "@/src/context/HistoryContext";

import theme from "@/src/theme";

import Spinner from "@/src/components/feature/Spinner";
import UnsupportedBrowserWarning from "@/src/components/feature/UnsupportedBrowserWarning";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApplicationContextProvider>
      <HistoryContextProvider>
        <ConversationWebsocketContextProvider>
          <MuiThemeProvider theme={theme}>
            <UnsupportedBrowserWarning>
              <NextNProgress color={"#fff"} />
              <CssBaseline />
              <Spinner />
              <Component {...pageProps} />
            </UnsupportedBrowserWarning>
          </MuiThemeProvider>
        </ConversationWebsocketContextProvider>
      </HistoryContextProvider>
    </ApplicationContextProvider>
  );
}
