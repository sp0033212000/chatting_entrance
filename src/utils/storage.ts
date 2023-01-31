export enum StorageProperties {
  ACCESS_TOKEN = '@CHATTING_ENTRANCE/ACCESS_TOKEN',
}

export interface StorageValueType extends Record<StorageProperties, any> {
  [StorageProperties.ACCESS_TOKEN]: string;
}

class Storage {
  private isBrowser = typeof window !== 'undefined' && typeof window !== void 0;
  private storage = this.isBrowser ? window.localStorage : null;

  get accessToken() {
    return this.storage?.getItem(StorageProperties.ACCESS_TOKEN) ?? null;
  }

  set accessToken(value) {
    this.storage?.setItem(StorageProperties.ACCESS_TOKEN, value ?? '');
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
      return value;
    }
  }

  public setter<P extends StorageProperties>(
    property: P,
    value: StorageValueType[P]
  ) {
    this.storage?.setItem(property, JSON.stringify(value));
  }
}

export const storage = new Storage();
