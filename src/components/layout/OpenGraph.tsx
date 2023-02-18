import React from "react";

import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
}

const OpenGraph: React.FC<Props> = ({
  title = "Chatting",
  description = "Chatting with world",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default OpenGraph;
