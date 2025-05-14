import WelcomeBanner from "../component/carddeck/WelcomeBanner";
import DomainDeck from "../component/carddeck/DomainDeck";
import CompanyDeck from "../component/carddeck/CompanyDeck";
import { useAuth } from "../component/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  return (
    <>
      {user ? (
        <div>
          <WelcomeBanner />
          <div className="grid grid-cols-12 gap-6">
            <CompanyDeck />
            <DomainDeck />
          </div>
        </div>
      ) : (
        <Link to="/loign">LogIn</Link>
      )}
    </>
  );
}
