import AccountSection from "./AccountSection";
import NavigationActions from "./NavigationActions";
import NexusLogo from "./NexusLogo";

export default function Header() {
  return (
    <header style={{
      backgroundColor: "#3E1F47"
    }}>
      <NexusLogo/>

      <NavigationActions />

      <AccountSection/>
    </header>
  )
}