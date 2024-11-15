"use client";

import { Button } from "@mui/material";
import { routes } from "~/layouts/header/links";

export default function NavigationActions() {
  const pathname = window?.location?.pathname || '/';

  const getActiveClass = (path: string) =>
    path === pathname ? 'border-x-8 border-y-0 border-dark-purple rounded-lg bg-dark-purple' : '';

  return routes.map(({ title, to }) => (
    <div key={title} className={`${getActiveClass(to)}`}>
      <Button color="white" href={to} variant="text" sx={{ textTransform: 'capitalize' }}>
        {title}
      </Button>
    </div>
  ));
}
