import React, { useRef, useState } from "react";

import { Theme, useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuContainer from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import MoreIcon from "@material-ui/icons/MoreVert";

import SettingsIcon from "@/src/components/icons/SettingsIcon";

import AboutDialog from "@/src/components/page/AboutDialog";
import ConnectionOptionsDialog from "@/src/components/page/ConnectionOptionsDialog";

import DeviceSelectionDialog from "./DeviceSelectionDialog";

export default function SettingsMenu({
  mobileButtonClass,
}: {
  mobileButtonClass?: string;
}) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);
  const [connectionSettingsOpen, setConnectionSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {isMobile ? (
        <Button
          ref={anchorRef}
          onClick={() => setMenuOpen(true)}
          startIcon={<MoreIcon />}
          className={mobileButtonClass}
        >
          More
        </Button>
      ) : (
        <Button
          ref={anchorRef}
          onClick={() => setMenuOpen(true)}
          startIcon={<SettingsIcon />}
        >
          Settings
        </Button>
      )}
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen((isOpen) => !isOpen)}
        anchorEl={anchorRef.current}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "left" : "right",
        }}
        transformOrigin={{
          vertical: 0,
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => setAboutOpen(true)}>
          <Typography variant="body1">About</Typography>
        </MenuItem>
        <MenuItem onClick={() => setDeviceSettingsOpen(true)}>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => setConnectionSettingsOpen(true)}>
          <Typography variant="body1">Connection Settings</Typography>
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
        open={deviceSettingsOpen}
        onClose={() => {
          setDeviceSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
      <ConnectionOptionsDialog
        open={connectionSettingsOpen}
        onClose={() => {
          setConnectionSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
