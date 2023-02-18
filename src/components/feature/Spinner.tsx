import React, { useEffect, useState } from "react";

import clsx from "clsx";

import { loadingEventEmitter } from "@/src/event";

import { SpinnerIcon } from "@/public/assets/image/icon";

import Flexbox from "@/src/components/common/Flexbox";
import Modal from "@/src/components/common/Modal";

export const InlineSpinner: React.FC = () => {
  return (
    <Flexbox
      align={"center"}
      justify={"center"}
      className={"fixed top-0 left-0 w-screen h-screen z-[999"}
    >
      <SpinnerIcon className={clsx("animate-[spin_1s_ease-in_infinite]")} />
    </Flexbox>
  );
};

const Spinner = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadingEventEmitter.on(setIsLoading);

    return () => {
      loadingEventEmitter.off(setIsLoading);
    };
  }, []);

  return (
    <Modal show={isLoading} zIndex={9999}>
      <SpinnerIcon className={clsx("animate-[spin_1s_ease-in_infinite]")} />
    </Modal>
  );
};

export default Spinner;
