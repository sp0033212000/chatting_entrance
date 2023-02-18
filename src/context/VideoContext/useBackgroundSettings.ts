import { useCallback, useEffect } from "react";

import { LocalVideoTrack, Room } from "twilio-video";

import {
  GaussianBlurBackgroundProcessor,
  ImageFit,
  isSupported,
  VirtualBackgroundProcessor,
} from "@twilio/video-processors";

import { StorageProperties } from "@/src/utils";

import { useLocalStorageState } from "@/src/hooks/useLocalStorageState";

import Abstract from "@/public/assets/image/Abstract.jpg";
import BohoHome from "@/public/assets/image/BohoHome.jpg";
import Bookshelf from "@/public/assets/image/Bookshelf.jpg";
import CoffeeShop from "@/public/assets/image/CoffeeShop.jpg";
import Contemporary from "@/public/assets/image/Contemporary.jpg";
import CozyHome from "@/public/assets/image/CozyHome.jpg";
import Desert from "@/public/assets/image/Desert.jpg";
import Fishing from "@/public/assets/image/Fishing.jpg";
import Flower from "@/public/assets/image/Flower.jpg";
import Kitchen from "@/public/assets/image/Kitchen.jpg";
import ModernHome from "@/public/assets/image/ModernHome.jpg";
import Nature from "@/public/assets/image/Nature.jpg";
import Ocean from "@/public/assets/image/Ocean.jpg";
import Patio from "@/public/assets/image/Patio.jpg";
import Plant from "@/public/assets/image/Plant.jpg";
import SanFrancisco from "@/public/assets/image/SanFrancisco.jpg";
import AbstractThumb from "@/public/assets/image/thumb/Abstract.jpg";
import BohoHomeThumb from "@/public/assets/image/thumb/BohoHome.jpg";
import BookshelfThumb from "@/public/assets/image/thumb/Bookshelf.jpg";
import CoffeeShopThumb from "@/public/assets/image/thumb/CoffeeShop.jpg";
import ContemporaryThumb from "@/public/assets/image/thumb/Contemporary.jpg";
import CozyHomeThumb from "@/public/assets/image/thumb/CozyHome.jpg";
import DesertThumb from "@/public/assets/image/thumb/Desert.jpg";
import FishingThumb from "@/public/assets/image/thumb/Fishing.jpg";
import FlowerThumb from "@/public/assets/image/thumb/Flower.jpg";
import KitchenThumb from "@/public/assets/image/thumb/Kitchen.jpg";
import ModernHomeThumb from "@/public/assets/image/thumb/ModernHome.jpg";
import NatureThumb from "@/public/assets/image/thumb/Nature.jpg";
import OceanThumb from "@/public/assets/image/thumb/Ocean.jpg";
import PatioThumb from "@/public/assets/image/thumb/Patio.jpg";
import PlantThumb from "@/public/assets/image/thumb/Plant.jpg";
import SanFranciscoThumb from "@/public/assets/image/thumb/SanFrancisco.jpg";

const imageNames: string[] = [
  "Abstract",
  "Boho Home",
  "Bookshelf",
  "Coffee Shop",
  "Contemporary",
  "Cozy Home",
  "Desert",
  "Fishing",
  "Flower",
  "Kitchen",
  "Modern Home",
  "Nature",
  "Ocean",
  "Patio",
  "Plant",
  "San Francisco",
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

let imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index].src;
  });
};

export const backgroundConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = "/virtualbackground";
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

export default function useBackgroundSettings(
  videoTrack: LocalVideoTrack | undefined,
  room?: Room | null
) {
  const [backgroundSettings, setBackgroundSettings] = useLocalStorageState(
    StorageProperties.SELECTED_BACKGROUND_SETTINGS_KEY,
    {
      type: "none",
      index: 0,
    }
  );

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [videoTrack]);

  const addProcessor = useCallback(
    (
      processor: GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor
    ) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [videoTrack, removeProcessor]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (backgroundSettings.type === "blur") {
        addProcessor(blurProcessor);
      } else if (
        backgroundSettings.type === "image" &&
        typeof backgroundSettings.index === "number"
      ) {
        virtualBackgroundProcessor.backgroundImage = await getImage(
          backgroundSettings.index
        );
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [backgroundSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [backgroundSettings, setBackgroundSettings] as const;
}
