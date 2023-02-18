import React from "react";

import { LocalAudioTrack } from "twilio-video";

import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import { storage, StorageProperties } from "@/src/utils";

import useDevices from "@/src/hooks/useDevices";
import useMediaStreamTrack from "@/src/hooks/useMediaStreamTrack";

import { useVideoContext } from "@/src/context/VideoContext";

import AudioLevelIndicator from "@/src/components/page/AudioLevelIndicator";

export default function AudioInputList() {
  const { audioInputDevices } = useDevices();
  const { localTracks } = useVideoContext();

  const localAudioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;
  const srcMediaStreamTrack = localAudioTrack?.noiseCancellation?.sourceTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId =
    srcMediaStreamTrack?.getSettings().deviceId ||
    mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    storage.setter(StorageProperties.SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Audio Input
      </Typography>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className="inputSelect">
          {audioInputDevices.length > 1 ? (
            <FormControl fullWidth>
              <Select
                onChange={(e) => replaceTrack(e.target.value as string)}
                value={localAudioInputDeviceId || ""}
                variant="outlined"
              >
                {audioInputDevices.map((device) => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>
              {localAudioTrack?.mediaStreamTrack.label || "No Local Audio"}
            </Typography>
          )}
        </div>
        <AudioLevelIndicator audioTrack={localAudioTrack} color="black" />
      </Grid>
    </div>
  );
}
