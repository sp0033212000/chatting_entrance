import jsCookie from "js-cookie";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { CHATTING_TOKEN_KEY } from "@/src/constant";

import { isNotSet, storage, StorageProperties } from "@/src/utils";

interface Method {
  callback: () => Promise<string | null>;
  forceCheck?: boolean;
}

interface DefaultTokenGetter {
  (): string | null | Promise<string | null>;
}

interface Hooks<UserProfile> {
  onBeforeAuth?: (token: string | null) => any;
  onAuthSuccess?: (token: string, user: UserProfile) => any;
  onAuthFailure?: (error: any) => any;
}

interface TokenValidator<UserProfile> {
  (token: string): Promise<UserProfile>;
}

interface Config<UserProfile> {
  methods: Array<Method>;
  tokenValidator: TokenValidator<UserProfile>;
  defaultTokenGetter?: DefaultTokenGetter;
  hooks?: Hooks<UserProfile>;
  throwErrorWhileNoUserAfterAuth?: boolean;
}

export class AuthenticateHelper<UserProfile> {
  constructor(private config: Config<UserProfile>) {}

  private _token: string | null = null;
  private get token(): string | null {
    return this._token;
  }

  private set token(value: string | null) {
    if (value) {
      storage.setter(StorageProperties.ACCESS_TOKEN, value);
      const parsedToken = jwtDecode<JwtPayload>(value);
      const expires = (parsedToken.exp ?? 0) * 1000;
      const domain = new URL(process.env.ENTRANCE_WEB_DOMAIN as string);

      jsCookie.set(CHATTING_TOKEN_KEY, value, {
        secure: true,
        expires,
        path: "/",
        domain: domain.hostname,
      });
    }
    this._token = value;
  }

  private _user: UserProfile | null = null;
  private get user(): UserProfile | null {
    return this._user;
  }

  private set user(value: UserProfile | null) {
    this._user = value;
  }

  async fire() {
    const {
      methods,
      defaultTokenGetter,
      tokenValidator,
      hooks,
      throwErrorWhileNoUserAfterAuth,
    } = this.config;
    try {
      this.token = (await defaultTokenGetter?.()) ?? null;
      let clonedMethods = [...methods];
      hooks?.onBeforeAuth?.(this.token);

      while (
        (isNotSet(this.token) || clonedMethods[0]?.forceCheck) &&
        clonedMethods.length > 0
      ) {
        const { callback, forceCheck } = clonedMethods[0];
        clonedMethods.shift();
        if (isNotSet(this.token) || forceCheck) {
          this.token = await callback();
        }
      }

      if (this.token) {
        this.user = await tokenValidator(this.token);
        if (this.user) {
          await hooks?.onAuthSuccess?.(this.token, this.user);
        } else if (throwErrorWhileNoUserAfterAuth) {
          throw "No user profile be reached after authentication.";
        }
      } else {
        throw "Token could not be reached by methods";
      }
    } catch (error: any) {
      hooks?.onAuthFailure?.(error);
    }
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }
}
