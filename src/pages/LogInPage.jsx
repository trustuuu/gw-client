import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { client, authServer } from "../api/igw-api";
import AuthFormHeader from "../component/AuthFormHeader";
import AuthFormExtra from "../component/AuthFormExtra";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/Utils";
import { useAuth } from "../component/AuthContext";
const style = {
  logo: { width: "18px", marginRight: "10px" },
  google: { width: "230px" },
  //microsoft: {width: '230px', background: 'rgba(158,158,158,.2)', backgroundColor: '#2F2F2F', color: 'white'},
};

export default function LogInPage() {
  //const { loginWithiGoodWorks } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies(["igw-udir"]);
  const [isRemember, setIsRemeber] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [codeChallenge, setCodeChallenge] = useState("");
  const [codeVerifier, setCodeVerifier] = useState("");
  const { saveCodeVerifier } = useAuth();
  const navigate = useNavigate();
  if (cookies.tokenJson) {
    const date = new Date();
    const now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );

    const expires_in =
      Math.floor(cookies.tokenJson.data.expires_in) <
      Math.floor(now_utc / 1000);
    if (!expires_in) {
      navigate("/callback");
    } else {
      removeCookie("tokenJson");
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const code_challenge_method = "sha256";
  const code_verifier = generateCodeVerifier();
  useEffect(() => {
    setCodeVerifier(code_verifier);
    saveCodeVerifier(code_verifier);
    generateCodeChallenge(code_verifier).then((response) => {
      setCodeChallenge(response);
    });
  }, []);

  const onSubmit = () => {
    setCookie("IsRemember", isRemember, {
      Expires: new Date(Date.now() + 3600 * 1000), // expires in 1 hour
      Secure: true, // cookie will only be sent over HTTPS
      SameSite: "Strict", // prevent cross-site request
      //httpOnly: true
    });
    setCookie("Email", formData.email, {
      Expires: new Date(Date.now() + 3600 * 1000), // expires in 1 hour
      Secure: true, // cookie will only be sent over HTTPS
      SameSite: "Strict", // prevent cross-site request
      //httpOnly: true
    });
    //e.preventDefault();
  };

  const getExtraDataChange = (remember) => {
    setIsRemeber(remember);
  };
  return (
    <div>
      <AuthFormHeader
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <form
        action={authServer.authLogin}
        method="POST"
        className="mt-8 space-y-6"
        onSubmit={onSubmit}
      >
        <div className="-space-y-px">
          <div className="col-md-12 text-center ">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 text-center ">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Enter Password"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 text-center ">
            <AuthFormExtra handleData={getExtraDataChange} />
          </div>
          <div className="col-md-12 text-center ">
            <p className="text-center *:text-sm text-neutral-400 dark:text-neutral-600">
              By signing up you accept our <a href="#">Terms Of Use</a>
            </p>
          </div>
          <div className="col-md-12 text-center ">
            <button
              type="submit"
              className=" btn btn-block mybtn btn-primary tx-tfm"
            >
              Login
            </button>
          </div>
          {/* <Row className={"w-full h-screen justify-center items-center"}>
                  <LoginButton ButtonComponent={ButtonDefault} buttonStyle={style.google} onClick={loginWithiGoodWorks} image={googleLogo} loginProvicer="iGoodWorks" />
                </Row>
                <Row className={"w-full h-screen justify-center items-center"}>
                  <LoginButton ButtonComponent={ButtonDefault} buttonStyle={style.google} onClick={loginWithGoogle} image={googleLogo} loginProvicer="구글" />
                </Row> */}
          <input type="hidden" name="client_id" value={client.client_id} />
          <input
            type="hidden"
            name="redirect_uri"
            value={client.redirect_uris}
          />
          <input type="hidden" name="scope" value={client.scope} />
          <input type="hidden" name="state" value={client.state} />
          <input type="hidden" name="code_challenge" value={codeChallenge} />
          <input
            type="hidden"
            name="code_challenge_method"
            value={code_challenge_method}
          />
          {/* <input type="hidden" name="code_verifier" value={codeVerifier} /> */}
        </div>
      </form>
    </div>
  );
}

function LoginButton({ buttonStyle, onClick, image, loginProvicer }) {
  return (
    <div className="flex justify-center my-2">
      <ButtonComponent
        className="flex items-center"
        style={buttonStyle}
        onClick={onClick}
      >
        <img style={style.logo} src={image} alt={loginProvicer} />
        {loginProvicer} 로그 인
      </ButtonComponent>
    </div>
  );
}
