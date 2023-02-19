// @ts-nocheck
/* eslint-disable */
/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum UserAuthIssuer {
  GOOGLE = "GOOGLE",
}

export interface UserProfileEntity {
  id: string;
  twilioSid: string;
  participantSid: string;
  name: string;
  email: string;
  pictureUrl?: string;
  issuer?: UserAuthIssuer;
}

export interface IssueGoogleOAuthEntity {
  authURL: string;
}

export interface ValidGoogleOAuthDto {
  code: string;
  scope: string;
  authuser: string;
  hd: string;
  prompt: string;
  redirect_url: string;
}

export interface ValidGoogleOAuthEntity {
  accessToken: string;
}

export interface ConversationEntity {
  id: string;
  active: boolean;
  participantIds: string[];
  creatorId: string;
  conversationSid: string;
  chatServiceSid: string;
  messagingServiceSid: string;
  uniqueName: string;
  roomName: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  pictureUrl?: string;
}

export interface FindConversationEntity {
  id: string;
  active: boolean;
  creatorId: string;
  conversationSid: string;
  chatServiceSid: string;
  messagingServiceSid: string;
  uniqueName: string;
  roomName: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  participants: ConversationParticipant[];
}

export interface JoinConversationEntity {
  id: string;
  userId: string;
  conversationId: string;
  token: string;
  active: boolean;
}

export enum ConversationWSEventEnum {
  CREATED = "CREATED",
  JOINED = "JOINED",
  LEAVED = "LEAVED",
}

export interface GetConversationSocketUrlEntity {
  url: string;
  eventType: ConversationWSEventEnum;
}

export interface JoinConversationDto {
  conversationId: string;
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }
}

/**
 * @title Chatting APis
 * @version 1.0
 * @contact
 *
 * The chatting API description
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  systemApi = {
    /**
     * No description
     *
     * @tags SystemApi
     * @name GetHello
     * @request GET:/
     */
    getHello: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/`,
        method: "GET",
        ...params,
      }),
  };
  authApi = {
    /**
     * No description
     *
     * @tags AuthApi
     * @name GetUserProfile
     * @summary getUserProfile 取得user profile
     * @request GET:/auth/me
     * @secure
     */
    getUserProfile: (params: RequestParams = {}) =>
      this.request<UserProfileEntity, any>({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthApi
     * @name IssueGoogleOAuth
     * @summary issueGoogleOAuth 取得redirectUri
     * @request GET:/auth/google/issue
     */
    issueGoogleOAuth: (
      query: {
        redirectUri: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<IssueGoogleOAuthEntity, any>({
        path: `/auth/google/issue`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthApi
     * @name ValidGoogleOAuth
     * @summary validGoogleOAuth 驗證google oauth
     * @request POST:/auth/google/valid
     */
    validGoogleOAuth: (data: ValidGoogleOAuthDto, params: RequestParams = {}) =>
      this.request<ValidGoogleOAuthEntity, any>({
        path: `/auth/google/valid`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  conversationApi = {
    /**
     * No description
     *
     * @tags ConversationApi
     * @name Create
     * @summary create 建立conversation
     * @request POST:/conversation
     * @secure
     */
    create: (params: RequestParams = {}) =>
      this.request<any, ConversationEntity>({
        path: `/conversation`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name FindAll
     * @summary findAll 取得所有conversation
     * @request GET:/conversation
     * @secure
     */
    findAll: (params: RequestParams = {}) =>
      this.request<any, FindConversationEntity[]>({
        path: `/conversation`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name ReJoin
     * @summary reJoin 返回已加入conversation
     * @request GET:/conversation/reJoin
     * @secure
     */
    reJoin: (params: RequestParams = {}) =>
      this.request<any, JoinConversationEntity[]>({
        path: `/conversation/reJoin`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name GetSocketUrl
     * @summary getSocketUrl 取得socket Url
     * @request GET:/conversation/getSocketUrl
     * @secure
     */
    getSocketUrl: (params: RequestParams = {}) =>
      this.request<any, GetConversationSocketUrlEntity>({
        path: `/conversation/getSocketUrl`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name FindOne
     * @summary findOne 取得特定conversation
     * @request GET:/conversation/{conversationId}
     * @secure
     */
    findOne: (conversationId: string, params: RequestParams = {}) =>
      this.request<any, FindConversationEntity[]>({
        path: `/conversation/${conversationId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name JoinConversation
     * @summary joinConversation 加入conversation
     * @request POST:/conversation/join
     * @secure
     */
    joinConversation: (data: JoinConversationDto, params: RequestParams = {}) =>
      this.request<any, JoinConversationEntity>({
        path: `/conversation/join`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ConversationApi
     * @name CloseConversation
     * @summary closeConversation 離開 conversation
     * @request DELETE:/conversation/close
     * @secure
     */
    closeConversation: (
      query: {
        conversationId: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/conversation/close`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),
  };
}
