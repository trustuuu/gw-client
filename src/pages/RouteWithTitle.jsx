import { useEffect } from "react";
import { useAuth } from "../component/AuthContext";

export default function RouteWithTitle({
  title,
  parentPath,
  subTitle,
  children,
}) {
  const { path, setPath } = useAuth();
  useEffect(() => {
    document.title = title;
    if (subTitle !== undefined) setPath({ ...path, title, parentPath });
    else setPath({ ...path, title, subTitle, parentPath });
  }, [title, subTitle, parentPath]);

  return children;
}
