import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PagePathHeader = () => {
  const location = useLocation();
  const { path } = useAuth();
  return (
    <div className="text-sm text-blue-400 p-2">
      <Link className="lowercase" to="/">
        Home
      </Link>
      {path && path.parentPath ? (
        <Link className="lowercase" to={`/${path.parentPath}`}>
          &nbsp;&gt;&nbsp;{path.parentPath}
        </Link>
      ) : null}
      <Link className="lowercase" to={`${location.pathname}`}>
        {path ? (
          path.title !== "Home" ? (
            <>&nbsp;&gt;&nbsp;{path.title}</>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {path ? path.subTitle ? <>&nbsp;(&nbsp;{path.subTitle})</> : "" : ""}
      </Link>
    </div>
  );
};

export default PagePathHeader;

const Breadcrumb = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean); // remove empty strings

  return (
    <div className="text-sm text-gray-600 p-2 lowercase">
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        return (
          <span key={path}>
            {" > "}
            <Link to={path} className="text-blue-500 hover:underline">
              {decodeURIComponent(segment)}
            </Link>
          </span>
        );
      })}
    </div>
  );
};
