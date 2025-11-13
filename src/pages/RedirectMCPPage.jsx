import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import { useEffect, useState } from "react";
import companyApi from "../api/company-api";
import domainApi from "../api/domain-api";

export function RedirectMCPPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const companyId = params.get("companyId");
  const domainId = params.get("domainId");
  const mode = params.get("mode");
  const status = params.get("status");
  const targetPage = params.get("targetPage");
  const Id = params.get("Id");

  console.log(
    "companyId, domainId, mode, targetPage, Id",
    companyId,
    domainId,
    mode,
    targetPage,
    Id
  );
  const {
    company: companyCtx,
    domain: domainCtx,
    path,
    setPath,
    setIsLoading,
  } = useAuth();
  const [company, setCompany] = useState(companyCtx);
  const [domain, setDomain] = useState(domainCtx);
  //const [targetState, SetTargetState] = useState({});

  const getCompany = async (companyId) => {
    setIsLoading(true);
    const coms = await companyApi.get(companyId);
    setCompany(coms.data);
    setIsLoading(false);
    return coms.data;
  };

  const getDomain = async (domainId) => {
    const doms = await domainApi.get(domainId);
    setDomain(doms.data);
    return doms.data;
  };

  useEffect(() => {
    const run = async () => {
      let companyData = company;
      let domainData = domain;

      if (companyId) {
        try {
          companyData = await getCompany(companyId);
          if (domainId) {
            domainData = await getDomain(domainId);
          }
        } catch (err) {
          console.error("Error loading company/domain", err);
        }
      }

      // Build target state
      let targetState = {
        company: companyData,
        domain: domainData,
        mode: mode ? mode : "new",
      };

      if (status) targetState = { ...targetState, status };
      navigate(`/${targetPage}`, {
        state: targetState,
      });
    };

    run();
  }, []);

  // const Component = componentMap[pageName]; // ✅ look up by string
  // if (!Component) {
  //   return <div>⚠️ Unknown component: {pageName}</div>;
  // }
  // return <Component />; // ✅ render dynamically
}
