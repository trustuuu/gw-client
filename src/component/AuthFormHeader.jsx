import { Link } from "react-router-dom";
import igwLogo from "../images/igw_logo.png";

export default function AuthFormHeader({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <img alt="" className="object-fill" src={igwLogo} />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-yellow-600">
        {heading}
      </h2>
      <p className="mt-2 text-center text-md dark:text-gray-400">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium dark:text-purple-600 hover:text-purple-400"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
