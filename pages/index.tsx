import { GetServerSideProps } from "next";

import Head from "next/head";

import { SwaggerAPI } from "@/src/swagger";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chatting</title>
        <meta name="description" content="chatting with world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={""}>Chatting</main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    data: { authURL },
  } = await SwaggerAPI.authApi.issueGoogleOAuth({
    redirectUri: `${
      process.env.ENTRANCE_WEB_DOMAIN || context.req.headers.host
    }/api/auth/identity`,
  });
  return {
    props: {
      googleAuthUrl: authURL,
    },
  };
};
