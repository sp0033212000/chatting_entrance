import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAsyncFn } from "react-use";

import jsCookie from "js-cookie";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { useRouter } from "next/router";

import { CHATTING_TOKEN_KEY, NOOP, pathname } from "@/src/constant";

import { SwaggerAPI } from "@/src/swagger";

import {
  AuthenticateHelper,
  isNotSet,
  storage,
  StorageProperties,
} from "@/src/utils";

import { UserProfileEntity } from "@/src/swagger/swagger.api";

interface State {
  user: UserProfileEntity | null;
  loadUserProfile: (
    profile?: UserProfileEntity
  ) => Promise<UserProfileEntity | null>;
  isSignedIn: boolean;
  signIn: (
    token: string,
    option?: {
      beforeReload?: () => any | Promise<any>;
      skipLiff?: boolean;
      skipReload?: boolean;
    }
  ) => void;
  signOut: () => void;
}

const ApplicationContext = createContext<State>({
  user: null,
  loadUserProfile: NOOP,
  isSignedIn: false,
  signIn: NOOP,
  signOut: NOOP,
});

export const ApplicationContextProvider: FC = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const router = useRouter();

  const [{ value: user = null }, loadUserProfile] = useAsyncFn(
    async (profile?: UserProfileEntity) => {
      if (profile) return profile;

      const authenticateHelper = new AuthenticateHelper({
        throwErrorWhileNoUserAfterAuth: true,
        defaultTokenGetter: () => {
          let token = jsCookie.get(CHATTING_TOKEN_KEY) ?? null;

          if (!token) token = storage.getter(StorageProperties.ACCESS_TOKEN);

          return token;
        },
        tokenValidator: () =>
          SwaggerAPI.authApi
            .getUserProfile({
              disableAlert: true,
              noRedirectAfterAuthFailure: true,
            })
            .then((response) => response.data),
        methods: [],
        hooks: {
          onAuthSuccess: (token) => {
            signIn(token, { skipReload: true });
          },
          onAuthFailure: (error) => {
            console.log(error);
            if (
              ![pathname.auth, pathname.authRedirect].includes(router.pathname)
            )
              router.replace(pathname.auth);
          },
        },
      });
      await authenticateHelper.fire();
      setIsSignedIn(true);
      return authenticateHelper.getUser();
    },
    []
  );

  useEffect(() => {
    if (
      [pathname.auth, pathname.authRedirect, pathname.loading].includes(
        router.pathname
      )
    )
      return;

    loadUserProfile();
  }, []);

  useEffect(() => {
    if (isNotSet(user) || !isSignedIn) return;

    if (
      [pathname.auth, pathname.authRedirect, pathname.loading].includes(
        router.pathname
      )
    )
      router.replace(pathname.landingPage);
  }, [isSignedIn, user]);

  const signOut = useCallback(async () => {
    storage.remove(StorageProperties.ACCESS_TOKEN);
    console.log("remove token when sign out");
    jsCookie.remove(CHATTING_TOKEN_KEY);
    router.reload();
  }, []);

  const signIn = useCallback<State["signIn"]>(
    async (token, { beforeReload = NOOP, skipReload = false } = {}) => {
      try {
        storage.accessToken = token;
        const expires = (jwtDecode<JwtPayload>(token).exp ?? 0) * 1000;
        jsCookie.set(CHATTING_TOKEN_KEY, token, {
          secure: process.env.NODE_ENV === "production",
          expires,
        });
        await beforeReload();
        if (!skipReload) router.reload();
      } catch (e) {
        alert(e);
      }
    },
    []
  );

  return (
    <ApplicationContext.Provider
      value={{
        user,
        loadUserProfile,
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => useContext(ApplicationContext);
