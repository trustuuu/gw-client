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
          <RouteWithTitle title="Delete" parentPath="users" subTitle="">
            <UserPage key="deletedUsers" status="deleted" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-new"
        element={
          <RouteWithTitle title="New" parentPath="users" subTitle="">
            <UserView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-view"
        element={
          <RouteWithTitle title="View" parentPath="users" subTitle="">
            <UserView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/users-edit"
        element={
          <RouteWithTitle title="Edit" parentPath="users" subTitle="">
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
          <RouteWithTitle title="Delete" parentPath="groups" subTitle="">
            <GroupPage key="deletedGroups" status="deleted" showTool={true} />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups-new"
        element={
          <RouteWithTitle title="New" parentPath="groups" subTitle="">
            <GroupView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups-view"
        element={
          <RouteWithTitle title="View" parentPath="groups" subTitle="">
            <GroupView />
          </RouteWithTitle>
        }
      />
      <Route
        path="/groups-edit"
        element={
          <RouteWithTitle title="Edit" parentPath="groups" subTitle="">
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
          <RouteWithTitle title="View" parentPath="applications" subTitle="">
            <ApplicationView key="appView" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-view-setting"
        element={
          <RouteWithTitle
            title="Properties"
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
          <RouteWithTitle title="New" parentPath="applications">
            <ApplicationPost key="appNew" mode="new" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/applications-view-permission-scope"
        element={
          <RouteWithTitle
            title="Permission Scope"
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
          <RouteWithTitle title="Overview" parentPath="apis" subTitle="">
            <ApiOverview key="apiOverview" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-brief"
        element={
          <RouteWithTitle title="View" parentPath="apis" subTitle="">
            <ApiView key="apiView" mode="overview" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-post"
        element={
          <RouteWithTitle title="Properties" parentPath="apis" subTitle="">
            <ApiPost key="apiPost" mode="view" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-permission-scope"
        element={
          <RouteWithTitle
            title="Permission Scope"
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
          <RouteWithTitle title="Roles" parentPath="apis" subTitle="">
            <ApiAppRolePage key="apiAppRoles" mode="edit" />
          </RouteWithTitle>
        }
      />
      <Route
        path="/apis-view-users-groups"
        element={
          <RouteWithTitle
            title="Users and Groups"
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
          <RouteWithTitle title="New">
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
        path="/authentication-resetpw"
        element={
          <RouteWithTitle title="Password Reset">
            <PasswordResetUsingCurrentPage />
          </RouteWithTitle>
        }
      />

      <Route
        path="/authentication-swith-user"
        element={
          <RouteWithTitle title="Swith user">
            <LogInPage />
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
