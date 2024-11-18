"use client";

import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Avatar,
  Drawer,
  Menu,
  Tooltip,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { Badge } from "~/components";
import { routes } from "./links";
import Link from "next/link";
import useTheme from "~/hooks/Theme";
import { useAuth } from "~/contexts/SurvivorContext";

export default function AccountSection() {
  const { logout } = useAuth();
  const { switchTheme } = useTheme();

  /** Mocked while the backend is not ready */
  const survivor = {
    name: "Nicolas Lima",
    login: "nlima",
    infected: true,
    coordinates: { latitude: 11.415, longitude: 21.125 },
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAvatarClick = (event) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const formatName = (name: string) => {
    const limitOfChars = 12;

    if (name.length > limitOfChars)
      return name.slice(0, limitOfChars).trim() + "...";

    return name;
  };

  return (
    <div>
      <Tooltip title="Account Details">
        <IconButton onClick={handleAvatarClick}>
          <Avatar
            src="https://avatars.githubusercontent.com/u/23743072?s=96&v=4"
            alt="Survivor Avatar"
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="w-64">
          <MenuItem onClick={(e) => e.preventDefault()}>
            <div className="flex items-center">
              <span className="text-md mr-8">{formatName(survivor.name)}</span>

              <Badge
                color={survivor.infected ? "red" : "green"}
                text={survivor.infected ? "Infected" : "Healthy"}
              />
            </div>
          </MenuItem>

          <MenuItem onClick={(e) => e.preventDefault()}>
            <span className="text-xs font-bold mr-1">Latitude:</span>
            <span className="text-xs">{survivor.coordinates.latitude}</span>

            <span className="text-xs font-bold ml-4 mr-1">Longitude:</span>
            <span className="text-xs">{survivor.coordinates.longitude}</span>
          </MenuItem>

          <MenuItem onClick={(e) => e.preventDefault()}>
            <span className="text-xs font-bold mr-1">Login:</span>
            <span className="text-xs">{survivor.login}</span>
          </MenuItem>

          <Divider />

          <MenuItem onClick={switchTheme}>
            <span className="text-md">Change theme</span>
          </MenuItem>

          <Divider />

          <MenuItem onClick={logout}>
            <span className="text-md">Logout</span>
          </MenuItem>
        </div>
      </Menu>

      <Drawer anchor="left" open={drawerOpen} onClose={handleClose}>
        <div
          className="w-48"
          role="presentation"
          onClick={handleClose}
          onKeyDown={handleClose}
        >
          <MenuItem onClick={(e) => e.preventDefault()}>
            <span className="text-md font-bold mr-2">{survivor.login}</span>
            <Badge
              color={survivor.infected ? "red" : "green"}
              text={survivor.infected ? "Infected" : "Healthy"}
            />
          </MenuItem>

          <MenuItem onClick={(e) => e.preventDefault()}>
            <span className="text-xs font-bold mr-1">Latitude:</span>
            <span className="text-xs">{survivor.coordinates.latitude}</span>
          </MenuItem>

          <MenuItem>
            <span className="text-xs font-bold mr-1">Longitude:</span>
            <span className="text-xs">{survivor.coordinates.longitude}</span>
          </MenuItem>

          <Divider />

          <div className="flex flex-col px-4 my-2">
            {routes.map(({ to, title }) => (
              <Link key={title} className="text-md my-2" href={to}>
                {title}
              </Link>
            ))}
          </div>

          <Divider />

          <MenuItem onClick={logout}>Logout</MenuItem>
        </div>
      </Drawer>
    </div>
  );
}
