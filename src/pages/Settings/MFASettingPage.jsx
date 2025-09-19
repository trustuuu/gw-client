import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mfaApi from "../../api/mfa-api";
import { useAuth } from "../../component/AuthContext";

function MFASettingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  //const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [mfaImage, setMfaImage] = useState(null);
  //const [mfaImageLink, setMfaImageLink] = useState(null);
  const [code, setCode] = useState("");
  const [btnLabel, setBtnLabel] = useState("Verify");
  const [otpResult, setOtpResult] = useState("");
  const { domain, user, setIsLoading } = useAuth();

  const loadMfaImage = async () => {
    setIsLoading(true);
    if (!token) {
      const imageLink = await mfaApi.getMfaLink(domain.id, user.email, user.id);
      const imageData = await mfaApi.getMFAImage(imageLink.data.token);

      setMfaImage(imageData.data);
    } else {
      const imageData = await mfaApi.getMFAImage(token);
      setMfaImage(imageData.data);
    }

    setIsLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (btnLabel == "Close") navigate(-1);
    const confirm = await mfaApi.verifyTotp(user.id, code);
    if (confirm.status == 200) {
      setOtpResult("Confirmed");
      setBtnLabel("Close");
    } else {
      setOtpResult("Wrong!");
      setBtnLabel("Verify");
    }
    console.log("confirm.status == 200", confirm.status == 200);
  };
  useEffect(() => {
    loadMfaImage();
  }, []);
  //if (!token) return <div>Missing token</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center">
        {" "}
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Multi-Factor Authentication
        </h1>
        <div className="flex flex-col items-center">
          {mfaImage ? (
            <img
              src={mfaImage}
              alt="From base64"
              style={{ maxWidth: "200px" }}
            />
          ) : (
            <></>
          )}
        </div>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code from your authenticator app
        </p>
        <form>
          <input
            type="text"
            maxlength="6"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-blue-700 text-center text-3xl tracking-widest p-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 mb-6"
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            {btnLabel}
          </button>
          <div
            className={`text-md ${
              otpResult == "Confirmed" ? "text-blue-500" : "text-red-500"
            }  mt-6`}
          >
            {otpResult}
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-6">
          Didn’t receive a code?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}

export default MFASettingPage;
