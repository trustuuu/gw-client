import igwLogo from "../images/igw_logo.png";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import { igwApi } from "../api/igw-api";

const LogOutPage = () => {
  const navigate = useNavigate();
  const [cookies, _setCookie, removeCookie] = useCookies(["igw-udir"]);
  const { saveUser, saveClient, saveCompany, saveDomain } = useAuth();

  const signOut = () => {
    //if (!cookies.IsRemember) {
    igwApi.logoutWithGoodWorks();
    saveUser(null);
    saveClient(null);
    saveCompany(null);
    saveDomain(null);
    sessionStorage.clear();
    //}
    navigate("/");
  };
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex gap-4 flex-col items-center justify-center px-6 mx-auto md:h-screen">
        <div className="flex flex-col items-center w-full bg-slate-300 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <img className="object-fill" src={igwLogo} alt="logo" />
          <div className="flex flex-col items-center p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Do you want to logout now?
            </h1>
            <button
              className="max-w-lg text-black bg-orange-300 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              onClick={signOut}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogOutPage;
