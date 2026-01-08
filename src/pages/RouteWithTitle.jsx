import { useEffect } from "react";
import { useAuth } from "../component/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RouteWithTitle({
  title,
  parentPath,
  subTitle,
  children,
}) {
  const navigate = useNavigate();
  const { path, setPath } = useAuth();
  const { isInitialized, user } = useAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      navigate("/login");
    }
  }, [user, isInitialized]);

  useEffect(() => {
    document.title = title;
    if (subTitle !== undefined) setPath({ ...path, title, parentPath });
    else setPath({ ...path, title, subTitle, parentPath });
  }, [title, subTitle, parentPath]);

  return children;
}
