import { NextApiRequest, NextApiResponse } from "next";

import { AxiosError } from "axios";
import { setCookie } from "cookies-next";

import add from "date-fns/add";

import { APIMethod, CHATTING_TOKEN_KEY, pathname } from "@/src/constant";

import { SwaggerAPI } from "@/src/swagger";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== APIMethod.GET) return res.status(404).send("NOT FOUND.");

  const { code, scope, authuser, hd, prompt } = req.query as {
    code: string;
    scope: string;
    authuser: string;
    hd: string;
    prompt: string;
  };

  try {
    const { data } = await SwaggerAPI.authApi.validGoogleOAuth(
      {
        code: code,
        scope: scope,
        authuser: authuser,
        hd: hd,
        prompt: prompt,
        redirect_url: `${
          process.env.ENTRANCE_WEB_DOMAIN || req.headers.host
        }/api/auth/identity/google`,
      },
      { disableAuth: true }
    );

    const domain = new URL(process.env.ENTRANCE_WEB_DOMAIN as string);

    setCookie(CHATTING_TOKEN_KEY, `Bearer ${data.accessToken}`, {
      path: "/",
      expires: add(new Date(), { days: 30 }),
      secure: true,
      domain: domain.hostname,
      res,
      req,
    });

    return res.redirect(`${process.env.ENTRANCE_WEB_DOMAIN}`);
  } catch (e) {
    const status = (e as AxiosError)?.response?.status;

    if (status === 401) return res.redirect(pathname.auth);

    return res.status(401).send("Something went wrong.");
  }
}
