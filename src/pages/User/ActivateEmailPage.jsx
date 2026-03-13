import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import userApi from "../../api/user-api";

export default function ActivateEmailPage() {
  const [searchParams] = useSearchParams();
  const d = searchParams.get("d");
  const i = searchParams.get("i");
  const s = searchParams.get("s");
  const data = { d, i, s };
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function activate() {
      if (!data) {
        setStatus("error");
        return;
      }

      try {
        const res = await userApi.activateEmail({ data });
        if (res.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    activate();
  }, [data]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold">Activating your email...</h1>
            <p className="text-gray-500 mt-2">Please wait.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-5xl mb-3">✓</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Email Activated
            </h1>
            <p className="mt-3 text-gray-600">
              Your email has been successfully verified.
            </p>

            <a
              href="/login"
              className="mt-6 inline-block w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700"
            >
              Go to Login
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-5xl mb-3">⚠</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Activation Failed
            </h1>
            <p className="mt-3 text-gray-600">
              The activation link is invalid or expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
