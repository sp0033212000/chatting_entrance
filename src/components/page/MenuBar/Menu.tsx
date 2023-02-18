import React, { useRef, useState } from "react";

import {
  Button,
  Menu as MenuContainer,
  MenuItem,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import CollaborationViewIcon from "@material-ui/icons/AccountBox";
import GridViewIcon from "@material-ui/icons/Apps";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { isSupported } from "@twilio/video-processors";
import { VideoRoomMonitor } from "@twilio/video-room-monitor";

import useFlipCameraToggle from "@/src/hooks/useFlipCameraToggle";

import { useAppStateContext } from "@/src/context/AppStateContext";
import { useChatContext } from "@/src/context/ChatContext";
import { useVideoContext } from "@/src/context/VideoContext";

import BackgroundIcon from "@/src/components/icons/BackgroundIcon";
import FlipCameraIcon from "@/src/components/icons/FlipCameraIcon";
import InfoIconOutlined from "@/src/components/icons/InfoIconOutlined";
import SettingsIcon from "@/src/components/icons/SettingsIcon";

import AboutDialog from "@/src/components/page/AboutDialog";

import DeviceSelectionDialog from "../DeviceSelectionDialog";

export const IconContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "1.5em",
  marginRight: "0.3em",
});

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { setIsGalleryViewActive, isGalleryViewActive } = useAppStateContext();
  const { setIsChatWindowOpen } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } =
    useFlipCameraToggle();

  return (
    <>
      <Button
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        ref={anchorRef}
        className={props.buttonClassName}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            More
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen((isOpen) => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>

        {isSupported && (
          <MenuItem
            onClick={() => {
              setIsBackgroundSelectionOpen(true);
              setIsChatWindowOpen(false);
              setMenuOpen(false);
            }}
          >
            <IconContainer>
              <BackgroundIcon />
            </IconContainer>
            <Typography variant="body1">Backgrounds</Typography>
          </MenuItem>
        )}

        {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            VideoRoomMonitor.toggleMonitor();
            setMenuOpen(false);
          }}
        >
          <IconContainer>
            <SearchIcon style={{ fill: "#707578", width: "0.9em" }} />
          </IconContainer>
          <Typography variant="body1">Room Monitor</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setIsGalleryViewActive((isGallery) => !isGallery);
            setMenuOpen(false);
          }}
        >
          <IconContainer>
            {isGalleryViewActive ? (
              <CollaborationViewIcon
                style={{ fill: "#707578", width: "0.9em" }}
              />
            ) : (
              <GridViewIcon style={{ fill: "#707578", width: "0.9em" }} />
            )}
          </IconContainer>
          <Typography variant="body1">
            {isGalleryViewActive ? "Speaker View" : "Gallery View"}
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => setAboutOpen(true)}>
          <IconContainer>
            <InfoIconOutlined />
          </IconContainer>
          <Typography variant="body1">About</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
