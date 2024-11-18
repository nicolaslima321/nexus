import Image from "next/image";

import Logo from "~/assets/logo.png";

export default function NexusLogo() {
  return (
    <Image
      className="rounded-lg"
      alt="nexus"
      src={Logo}
      height={32}
      width={32}
    />
  );
}
