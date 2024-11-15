import AccountSection from "./AccountSection";
import NavigationActions from "./NavigationActions";
import NexusLogo from "./NexusLogo";

export default function Header() {
  return (
    <header
      className="flex items-center justify-between bg-purple px-4 py-1 sm:py-2 sm:px-32"
    >
      <div className="w-[32] h-[32] flex items-center gap-6">
        <NexusLogo/>

        <p className="invisible text-white sm:visible sm:text-l">
          Survival Nexus
        </p>
      </div>

      <div className="hidden text-white md:flex md:w-4/12 md:justify-between">
        <NavigationActions />
      </div>

      <AccountSection/>
    </header>
  )
}
