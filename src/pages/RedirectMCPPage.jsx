import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import { useEffect, useState } from "react";
import companyApi from "../api/company-api";
import domainApi from "../api/domain-api";
import userApi from "../api/user-api";
import groupApi from "../api/group-api";

export function RedirectMCPPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const companyId = params.get("companyId");
  const domainId = params.get("domainId");
  const mode = params.get("mode");
  const status = params.get("status");
  const targetPage = params.get("targetPage");
  const userId = params.get("userId");
  const groupId = params.get("groupId");

  const {
    company: companyCtx,
    domain: domainCtx,
    saveCompany,
    saveDomain,
    path,
    setPath,
    setIsLoading,
  } = useAuth();

  const [company, setCompany] = useState(companyCtx);
  const [domain, setDomain] = useState(domainCtx);
  const [user, setUser] = useState({});
  const [group, setGroup] = useState({});

  const getCompany = async (companyId) => {
    setIsLoading(true);
    const coms = await companyApi.get(companyId);
    setIsLoading(false);
    return coms.data;
  };

  const getDomain = async (domainId) => {
    const doms = await domainApi.get(domainId);
    return doms.data;
  };

  const getGroup = async (id) => {
    const groupData = await groupApi.get(company.id, domain.id, id);
    return groupData.data;
  };

  const getUser = async (id) => {
    // const condition =
    //   status === "active"
    //     ? ["status", "!=", "deleted"]
    //     : ["status", "==", status];
    const userData = await userApi.get(company.id, domain.id, id);
    return userData.data;
  };

  useEffect(() => {
    const run = async () => {
      let companyData = company;
      let domainData = domain;
      let userData = user;
      let groupData = group;

      if (companyId) {
        try {
          companyData = await getCompany(companyId);
          saveCompany(companyData);
          if (domainId) {
            domainData = await getDomain(domainId);
            saveDomain(domainData);
          }
        } catch (err) {
          console.error("Error loading company/domain", err);
        }
      }
      try {
        if (userId) {
          userData = await getUser(userId);
        }
      } catch (err) {
        console.error("Error loading user", err);
      }

      try {
        if (groupId) {
          groupData = await getGroup(groupId);
        }
      } catch (err) {
        console.error("Error loading user", err);
      }

      // Build target state
      let targetState = {
        company: companyData,
        domain: domainData,
        user: userData,
        group: groupData,
        mode: mode ? mode : "new",
      };

      if (status) targetState = { ...targetState, status };
      if (companyData !== undefined) {
        navigate(`/${targetPage}`, {
          state: targetState,
        });
      }
    };

    run();
  }, []);

  // const Component = componentMap[pageName]; // ✅ look up by string
  // if (!Component) {
  //   return <div>⚠️ Unknown component: {pageName}</div>;
  // }
  // return <Component />; // ✅ render dynamically
}
