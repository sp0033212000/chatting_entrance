import { useEffect, useState } from "react";

import clsx from "clsx";

import { loadingEventEmitter } from "@/src/event";

import { SpinnerIcon } from "@/public/assets/image/icon";

import Modal from "@/src/components/common/Modal";

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
