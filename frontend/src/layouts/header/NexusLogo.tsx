import Image from 'next/image';
import Logo from '~/assets/logo.png';

export default function NexusLogo() {
  return (
    <Image
      alt="nexus"
      src={Logo}
      height={48}
      width={48}
    />
  );
};
