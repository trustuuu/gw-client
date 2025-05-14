import React from "react";
import { useAuth } from "./AuthContext";
import Loader from "react-spinners/RotateLoader";

// const override = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

const LoadingWrapper = ({ children }) => {
  const { isLoading } = useAuth();
  return (
    <div>
      {children}
      {isLoading && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
          <Loader color="#65dacc" />
        </div>
      )}
    </div>
  );
};

export default LoadingWrapper;
