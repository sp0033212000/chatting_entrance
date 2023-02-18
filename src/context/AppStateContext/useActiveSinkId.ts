import { useCallback, useEffect, useState } from "react";

import { storage, StorageProperties } from "@/src/utils";

import useDevices from "@/src/hooks/useDevices";

export default function useActiveSinkId() {
  const { audioOutputDevices } = useDevices();
  const [activeSinkId, _setActiveSinkId] = useState("default");

  const setActiveSinkId = useCallback((sinkId: string) => {
    storage.setter(StorageProperties.SELECTED_AUDIO_OUTPUT_KEY, sinkId);
    _setActiveSinkId(sinkId);
  }, []);

  useEffect(() => {
    const selectedSinkId = storage.getter(
      StorageProperties.SELECTED_AUDIO_OUTPUT_KEY
    );
    const hasSelectedAudioOutputDevice = audioOutputDevices.some(
      (device) => selectedSinkId && device.deviceId === selectedSinkId
    );
    if (hasSelectedAudioOutputDevice) {
      _setActiveSinkId(selectedSinkId!);
    }
  }, [audioOutputDevices]);

  return [activeSinkId, setActiveSinkId] as const;
}
