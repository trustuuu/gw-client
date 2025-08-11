import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthFormHeader from "../component/AuthFormHeader";
import Stepper from "../component/Stepper";
import DisplayPanel from "../component/DisplayPanel";
import {
  signupFields,
  companyFields,
  domainFields,
} from "../constants/formFields";
import FormAction from "../component/FormAction";
import userApi from "../api/user-api";
import companyApi from "../api/company-api";
import domainApi from "../api/domain-api";
import { authServer } from "../api/igw-api";

export default function SignUp() {
  const [userState, setUserState] = useState({});
  const [companyState, setCompanyState] = useState({});
  const [domainState, setDomainState] = useState({});
  const [errorText] = useState();
  const navigate = useNavigate();
  const mode = "new";
  const handleChange = (e, currentFields, itemState, setState) => {
    const currentItem = currentFields.filter((f) => f.id === e.target.id)[0];
    const itemValue =
      e.target.type === "checkbox" //e.target.value === "true" || e.target.value === "false"
        ? e.target.checked
        : currentItem.valueType !== undefined &&
          currentItem.valueType === "array"
        ? e.target.value.split(/\r\n|\n|\r/)
        : e.target.value;

    setState({ ...itemState, [e.target.id]: itemValue });
  };

  const handleChangeUser = (e) => {
    handleChange(e, signupFields, userState, setUserState);
  };
  const handleChangeCompany = (e) => {
    handleChange(e, companyFields, companyState, setCompanyState);
  };
  const handleChangeDomain = (e) => {
    handleChange(e, domainFields, domainState, setDomainState);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(authServer.signup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          company: {
            ...companyState,
            id: companyState.name,
            type: "customer",
          },
          domain: {
            ...domainState,
            id: domainState.name,
          },
          user: {
            ...userState,
            id: userState.userName,
            root: true,
          },
        },
      }),
    });
    navigate("/login");
    // delete userState.confirmPassword;

    // const com = await companyApi.create(
    //   {
    //     ...companyState,
    //     id: companyState.name,
    //     type: "customer",
    //   },
    //   {
    //     skipInterceptor: true,
    //   }
    // );
    // const dom = await domainApi.create(
    //   com.data.id,
    //   {
    //     ...domainState,
    //     id: domainState.name,
    //   },
    //   {
    //     skipInterceptor: true,
    //   }
    // );
    // await userApi.create(
    //   com.data.id,
    //   dom.data.id,
    //   {
    //     ...userState,
    //     id: userState.username,
    //     root: true,
    //   },
    //   {
    //     skipInterceptor: true,
    //   }
    // );
    //navigate("/login");
  };

  const handleCancel = (event) => {
    navigate(-1);
    event.preventDefault();
  };

  const steps = [
    {
      title: "User ID/PW",
      page: DisplayPanel(
        "General Settings",
        signupFields,
        null,
        userState,
        handleChangeUser,
        mode
      ),
      verify: () => {
        if (userState.authVerification == userState.confirmPassword)
          return "success";
        else return "password is not matched!";
      },
    },
    {
      title: "Company Information",
      page: DisplayPanel(
        "Company Infomation",
        companyFields,
        null,
        companyState,
        handleChangeCompany,
        mode
      ),
    },
    {
      title: "Domain Information",
      page: DisplayPanel(
        "Domain Information",
        domainFields,
        null,
        domainState,
        handleChangeDomain,
        mode
      ),
    },
  ];

  return (
    <div>
      <AuthFormHeader
        heading="Register your account"
        paragraph="Do you have account already? "
        linkName="Login"
        linkUrl="/login"
      />
      <div className="flex justify-center">
        <form className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div>
            <Stepper steps={steps} handleSubmit={handleSubmit} />
          </div>
          <div className="flex justify-center">
            <div>
              <FormAction handleSubmit={handleCancel} text="Cancel" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
