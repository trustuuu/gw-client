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
import ApiAppRolePage from "./Api/ApiAppRolePage";
import ApiPermissionScopePage from "./Api/ApiPermissionScopePage";
import ApiOverview from "./Api/ApiOverview";
import ApiUsersGroupsPage from "./Api/ApiUsersGroupsPage";
import RouteWithTitle from "./RouteWithTitle";
import ApplicationPermissionScopePage from "./Application/ApplicationPermissionScopePage";

function RoutesMain() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <RouteWithTitle title="Dashboard">
            <Dashboard />
          </RouteWithTitle>
        }
      />
      <Route path="/callback" element={<AuthCallback />} />
      <Route
        path="/onboarding-companies"
        element={
          <RouteWithTitle title="Company">
            <CompanyPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/onboarding-company-new"
        element={
          <RouteWithTitle title="Company | New">
            <CompanyPost />
          </RouteWithTitle>
        }
      />
      <Route
        path="/onboarding-domains"
        element={
          <RouteWithTitle title="Domain">
            <DomainPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/onboarding-domain-new"
        element={
          <RouteWithTitle title="Domain | New">
            <DomainPost />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users"
        element={
          <RouteWithTitle title="Users">
            <UserPage key="allUsers" status="active" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-deleted"
        element={
          <RouteWithTitle title="User | Delete">
            <UserPage key="deletedUsers" status="deleted" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-new"
        element={
          <RouteWithTitle title="User | New">
            <UserView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups"
        element={
          <RouteWithTitle title="Groups">
            <GroupPage key="allGroups" status="active" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups-deleted"
        element={
          <RouteWithTitle title="Groups | Delete">
            <GroupPage key="deletedGroups" status="deleted" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups-new"
        element={
          <RouteWithTitle title="Group | New">
            <GroupView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications"
        element={
          <RouteWithTitle title="Applications">
            <ApplicationPage key="app" status="active" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-brief"
        element={
          <RouteWithTitle
            title="Applications | View"
            parentPath="applications"
            subTitle=""
          >
            <ApplicationView key="appView" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-view-setting"
        element={
          <RouteWithTitle
            title="Applciation"
            parentPath="applications"
            subTitle=""
          >
            <ApplicationPost key="appNew" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-view-post"
        element={
          <RouteWithTitle title="Applciation" parentPath="applications">
            <ApplicationPost key="appNew" mode="new" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-view-permission-scope"
        element={
          <RouteWithTitle
            title="Applciation | Permission Scope"
            parentPath="applications"
            subTitle=""
          >
            <ApplicationPermissionScopePage
              key="appPermissionScope"
              mode="edit"
            />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis"
        element={
          <RouteWithTitle title="Apis">
            <ApiPage key="api" status="active" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-overview"
        element={
          <RouteWithTitle title="Api | Overview" parentPath="apis" subTitle="">
            <ApiOverview key="apiOverview" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-brief"
        element={
          <RouteWithTitle title="Api | View" parentPath="apis" subTitle="">
            <ApiView key="apiView" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-post"
        element={
          <RouteWithTitle title="Api" parentPath="apis" subTitle="">
            <ApiPost key="apiPost" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-permission-scope"
        element={
          <RouteWithTitle
            title="Api | Permission Scope"
            parentPath="apis"
            subTitle=""
          >
            <ApiPermissionScopePage key="apiPermissionScope" mode="edit" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-apirole"
        element={
          <RouteWithTitle title="Api | Role" parentPath="apis" subTitle="">
            <ApiAppRolePage key="apiAppRoles" mode="edit" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-users-groups"
        element={
          <RouteWithTitle
            title="Api | Users and Groups"
            parentPath="apis"
            subTitle=""
          >
            <ApiUsersGroupsPage key="apiAppUsersGroups" mode="edit" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apisnew"
        element={
          <RouteWithTitle title="Api | New">
            <ApiView key="apiNew" mode="new" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/error"
        element={
          <RouteWithTitle title="Error">
            <ErrorPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/login"
        element={
          <RouteWithTitle title="Login">
            <LogInPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/logout"
        element={
          <RouteWithTitle title="Logout">
            <LogOutPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/signup"
        element={
          <RouteWithTitle title="SignUp">
            <SignUp />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-resetpw"
        element={
          <RouteWithTitle title="Password Reset">
            <PasswordResetUsingCurrentPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/resetpw-send"
        element={
          <RouteWithTitle title="Password Reset Send">
            <PasswordResetPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/resetpw-link"
        element={
          <RouteWithTitle title="Password Reset Link">
            <PasswordResetFromLinkPage />
          </RouteWithTitle>
        }
      />
      <Route
        path="/"
        element={
          <RouteWithTitle title="Home">
            <Dashboard />
          </RouteWithTitle>
        }
      />
    </Routes>
  );
}

export default RoutesMain;
