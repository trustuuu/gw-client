import React from "react";
import { Routes, Route } from "react-router-dom";

import LogInPage from "./LogInPage";
import LogOutPage from "./LogOutPage";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import ErrorPage from "./ErrorPage";
//import ServiceAccountCreationPage from './ServiceAccountCreationPage';
import AuthCallback from "./AuthCallback";
import CompanyPage from "./Company/CompanyPage";
import CompanyPost from "./Company/CompanyPost";
import DomainPage from "./Domain/DomainPage";
import DomainPost from "./Domain/DomainPost";
import UserPage from "./User/UserPage";
import UserPost from "./User/UserPost";
import UserView from "./User/UserView";

import GroupPage from "./Group/GroupPage";
import GroupView from "./Group/GroupView";

import ApplicationPage from "./Application/ApplicationPage";
import ApplicationView from "./Application/ApplicationView";
import ApplicationPost from "./Application/ApplicationPost";
import ApiPage from "./Api/ApiPage";
import ApiView from "./Api/ApiView";
import ApiPost from "./Api/ApiPost";
import PasswordResetPage from "./User/PasswordResetPage";
import PasswordResetFromLinkPage from "./User/PasswordResetFromLinkPage";
import PasswordResetUsingCurrentPage from "./User/PasswordResetUsingCurrentPage";

function RoutesMain() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/callback" element={<AuthCallback />} />

      <Route path="/onboarding-companies" element={<CompanyPage />} />
      <Route path="/onboarding-company-new" element={<CompanyPost />} />
      <Route path="/onboarding-domains" element={<DomainPage />} />
      <Route path="/onboarding-domain-new" element={<DomainPost />} />

      <Route
        path="/users"
        element={<UserPage key="allUsers" status="active" showTool={true} />}
      />
      <Route
        path="/users-deleted"
        element={
          <UserPage key="deletedUsers" status="deleted" showTool={true} />
        }
      />
      <Route path="/users-new" element={<UserView />} />

      <Route
        path="/groups"
        element={<GroupPage key="allGroups" status="active" showTool={true} />}
      />
      <Route
        path="/groups-deleted"
        element={
          <GroupPage key="deletedGroups" status="deleted" showTool={true} />
        }
      />
      <Route path="/groups-new" element={<GroupView />} />

      <Route
        path="/applications"
        element={<ApplicationPage key="app" status="active" />}
      />
      <Route
        path="/applications-view"
        element={<ApplicationView key="appView" mode="view" />}
      />
      <Route
        path="/applications-new"
        element={<ApplicationPost key="appNew" mode="new" />}
      />
      <Route path="/apis" element={<ApiPage key="api" status="active" />} />
      <Route
        path="/apis-view"
        element={<ApiView key="apiView" mode="view" />}
      />
      <Route path="/apis-new" element={<ApiView key="apiNew" mode="new" />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/logout" element={<LogOutPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/resetpw" element={<PasswordResetUsingCurrentPage />} />
      <Route path="/resetpw-send" element={<PasswordResetPage />} />
      <Route path="/resetpw-link" element={<PasswordResetFromLinkPage />} />
      <Route path="/" element={<LogInPage />} />
    </Routes>
  );
}

export default RoutesMain;
