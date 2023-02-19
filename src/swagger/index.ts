import { NextApiResponse } from "next";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { parse } from "cookie";
import jsCookie from "js-cookie";
import jwtDecode from "jwt-decode";

import { redirect } from "next/dist/server/api-utils";
import { isBrowser } from "react-use/lib/misc/util";

import { CHATTING_TOKEN_KEY, pathname } from "@/src/constant";

import { loadingEventEmitter } from "@/src/event";

import { isNotEmptyArray, storage, StorageProperties } from "@/src/utils";

import { Api as SwaggerApiInstance } from "./swagger.api";

const baseURL = isBrowser
  ? `${window.location.origin}/rewrite/chatting-api`
  : `${process.env.CHATTING_API_URL}`;

const API = axios.create({
  baseURL,
});

const PureAPI = axios.create();

export const requestHandler = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  if (isBrowser) {
    if (!config.disableAuth) {
      const cookies = jsCookie.get();
      const token = cookies[CHATTING_TOKEN_KEY];
      if (token) {
        const tokenInfo = jwtDecode<{ application: string }>(token);

        if (tokenInfo?.application === "chatting") {
          config.headers![CHATTING_TOKEN_KEY] = token;
        } else {
          jsCookie.remove(CHATTING_TOKEN_KEY);
        }
      }
    }
  } else {
    if (!config.disableAuth) {
      const req = config.serverRequest;
      const cookie = req?.headers.cookie;
      const token = parse(cookie ?? "")?.[CHATTING_TOKEN_KEY];
      const tokenInfo = jwtDecode<{ application: string }>(token);

      if (cookie && token && tokenInfo?.application === "chatting") {
        config.headers.cookie = cookie;
        config.headers[CHATTING_TOKEN_KEY] = token;
      }
    }
  }
  if (!config.disableLoader) {
    loadingEventEmitter.emit(true);
  }

  return config;
};

export const responseHandler = (response: AxiosResponse) => {
  if (!response.config.disableLoader) {
    loadingEventEmitter.emit(false);
  }
  return response;
};

export const responseErrorHandler = (error: AxiosError) => {
  loadingEventEmitter.emit(false);
  const data = error.response?.data as any;
  const config = error.config;
  if (!config?.disableAlert) {
    if (isBrowser) {
      const name: string = data?.name || "";
      const messages: Array<string> = data?.messages || [];
      if (isNotEmptyArray(messages)) {
        const isBypass = (error?.config?.bypassErrorNames || []).includes(name);
        if (!isBypass && Number(data?.code) !== 401) {
          alert(`
            name: ${name}
            message:
            ----> ${messages.join("\n----> ")}
          `);
        }
      }
    }
  }
  if (Number(data?.statusCode) === 401 && !config?.noRedirectAfterAuthFailure) {
    if (isBrowser) {
      storage.remove(StorageProperties.ACCESS_TOKEN);
      // window.location.replace(pathname.auth);
    } else {
      jsCookie.remove(CHATTING_TOKEN_KEY);
      if (config?.serverResponse) {
        redirect(config.serverResponse as NextApiResponse, 307, pathname.auth);
      }
    }
  }

  return Promise.reject(error);
};

API.interceptors.request.use(requestHandler);
API.interceptors.response.use(responseHandler, responseErrorHandler);

PureAPI.interceptors.request.use(requestHandler);
PureAPI.interceptors.response.use(responseHandler, responseErrorHandler);

const Swagger = new SwaggerApiInstance();
Swagger.instance = API;

export const SwaggerAPI = Swagger;

export { PureAPI };
export default API;
