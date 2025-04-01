import WelcomeBanner from "../component/carddeck/WelcomeBanner";
import DomainDeck from "../component/carddeck/DomainDeck";
import CompanyDeck from "../component/carddeck/CompanyDeck";

export default function Dashboard() {
  return (
    <div>
      {/* Welcome banner */}
      <WelcomeBanner />
      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        <CompanyDeck />
        <DomainDeck />
      </div>
    </div>
  );
}
