import { useCallback } from "react";

import clsx from "clsx";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

import { SwaggerAPI } from "@/src/swagger";

import Button from "@/src/components/common/Button";
import Flexbox from "@/src/components/common/Flexbox";

const Auth = () => {
  const router = useRouter();

  const onSignInWithGoogleClick = useCallback(async () => {
    const { data } = await SwaggerAPI.authApi.issueGoogleOAuth({
      redirectUri: `${process.env.ENTRANCE_WEB_DOMAIN}/api/auth/identity/google`,
    });
    await router.replace(data.authURL);
  }, []);

  return (
    <Flexbox
      align={"center"}
      justify={"center"}
      className={clsx("w-full min-h-screen")}
    >
      <Button buttonType={"pink"} onClick={onSignInWithGoogleClick}>
        Sign In With <FontAwesomeIcon icon={faGoogle} className={"ml-1"} />
      </Button>
    </Flexbox>
  );
};

export default Auth;
