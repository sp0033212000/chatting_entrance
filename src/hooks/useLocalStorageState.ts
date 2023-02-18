import React, { useEffect, useState } from "react";

import { storage, StorageProperties, StorageValueType } from "@/src/utils";

/* This hook is like a useState() hook, but it will store the state in LocalStorage.
   If a value exists in LocalStorage, it will be returned as the initial value when
   this hook is run for the first time. Because this hook uses LocalStorage, it can
   only use values that can be serialized to and from JSON.
*/

export function useLocalStorageState<P extends StorageProperties>(
  key: P,
  initialState: StorageValueType[P]
): [
  StorageValueType[P],
  React.Dispatch<React.SetStateAction<StorageValueType[P]>>
];
export function useLocalStorageState<P extends StorageProperties>(
  key: P,
  initialState: StorageValueType[P] | null = null
) {
  const [value, setValue] = useState(() => {
    const item = storage.getter(key);
    return item ?? initialState;
  });

  useEffect(() => {
    storage.setter(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
