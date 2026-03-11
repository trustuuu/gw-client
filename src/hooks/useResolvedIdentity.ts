import { useLocation } from "react-router-dom";
import { useAuth } from "../component/AuthContext";

export const useResolvedIdentity = () => {
  const {
    setIsLoading,
    company: companyAuth,
    domain: domainAuth,
    activeUser: userAuth,
    group: groupAuth,
  } = useAuth();

  const location = useLocation();
  const {
    company: companyState,
    domain: domainState,
    user: userState,
    group: groupState,
    mode: initMode,
  } = location.state || {};

  // Hierarchy: Use location state if available, otherwise fallback to Auth
  const user = userState ?? userAuth;
  const group = groupState ?? groupAuth;
  const domain = domainState ?? domainAuth;
  const company = companyState ?? companyAuth;
  const mode = initMode ?? "new";

  return {
    user,
    group,
    domain,
    company,
    setIsLoading,
    mode,
    // Optional: add a boolean to know where the data came from
    isFromState: !!userState,
  };
};
