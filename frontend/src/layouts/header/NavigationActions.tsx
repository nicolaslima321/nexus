import Link from "next/link";
import { routes } from "~/layouts/header/links";

export default function NavigationActions() {
  return routes.map(({ title, to }) => (
    <Link key={title} href={to}>{title}</Link>
  ));
};
