import { BackgroundSettings } from "@/types/global";

export enum StorageProperties {
  ACCESS_TOKEN = "@CHATTING_ENTRANCE/ACCESS_TOKEN",
  IS_GALLERY_VIEW_ACTIVE = "gallery-view-active-key",
  MAX_GALLERY_VIEW_PARTICIPANTS = "max-gallery-participants-key",
  SELECTED_BACKGROUND_SETTINGS_KEY = "TwilioVideoApp-selectedBackgroundSettings",
  SELECTED_VIDEO_INPUT_KEY = "TwilioVideoApp-selectedVideoInput",
  SELECTED_AUDIO_OUTPUT_KEY = "TwilioVideoApp-selectedAudioOutput",
  SELECTED_AUDIO_INPUT_KEY = "TwilioVideoApp-selectedAudioInput",
}

export interface StorageValueType extends Record<StorageProperties, any> {
  [StorageProperties.ACCESS_TOKEN]: string;
  [StorageProperties.IS_GALLERY_VIEW_ACTIVE]: boolean;
  [StorageProperties.MAX_GALLERY_VIEW_PARTICIPANTS]: number;
  [StorageProperties.SELECTED_BACKGROUND_SETTINGS_KEY]: BackgroundSettings;
  [StorageProperties.SELECTED_VIDEO_INPUT_KEY]: string;
  [StorageProperties.SELECTED_AUDIO_OUTPUT_KEY]: string;
  [StorageProperties.SELECTED_AUDIO_INPUT_KEY]: string;
}

class Storage {
  private isBrowser = typeof window !== "undefined" && typeof window !== void 0;
  private storage = this.isBrowser ? window.localStorage : null;

  get accessToken() {
    return this.storage?.getItem(StorageProperties.ACCESS_TOKEN) ?? null;
  }

  set accessToken(value) {
    this.storage?.setItem(StorageProperties.ACCESS_TOKEN, value ?? "");
  }

  public remove(property: StorageProperties) {
    this.storage?.removeItem(property);
  }

  public getter<P extends StorageProperties>(
    property: P
  ): StorageValueType[P] | null {
    const value = this.storage?.getItem(property);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value as StorageValueType[P];
    }
  }

  public setter<P extends StorageProperties>(
    property: P,
    value: StorageValueType[P] | null
  ) {
    this.storage?.setItem(property, JSON.stringify(value));
  }
}

export const storage = new Storage();
