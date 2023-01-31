import EE from "eventemitter3";

const hungerEvent = new EE();

export const loadingEventEmitter = {
	on: (fn: (isLoading: boolean) => void) => hungerEvent.on("loading", fn),
	off: (fn: (isLoading: boolean) => void) => hungerEvent.off("loading", fn),
	emit: (isLoading: boolean) => hungerEvent.emit("loading", isLoading),
};
