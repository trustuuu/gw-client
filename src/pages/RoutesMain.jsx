import React from "react";
import { Switch, Route } from "react-router-dom";

import LogInPage from "./LogInPage";
import LogOutPage from "./LogOutPage";
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

import GroupPage from "./Group/GroupPage";
import GroupView from "./Group/GroupView";

import ApplicationPage from "./Application/ApplicationPage";
import ApplicationView from "./Application/ApplicationView";
import ApplicationPost from "./Application/ApplicationPost";
import ApiPage from "./Api/ApiPage";
import ApiView from "./Api/ApiView";
import ApiPost from "./Api/ApiPost";

function RoutesMain() {
  return (
    <Switch>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/callback">
        <AuthCallback />
      </Route>
      {/* <Route path="/service">
            <ServiceAccountCreationPage />
        </Route> */}
      <Route path="/onboarding-companies">
        <CompanyPage />
      </Route>
      <Route path="/onboarding-company-new">
        <CompanyPost />
      </Route>
      <Route path="/onboarding-domains">
        <DomainPage />
      </Route>
      <Route path="/onboarding-domain-new">
        <DomainPost />
      </Route>
      <Route path="/users">
        <UserPage key="allUsers" status="active" showTool={true} />
      </Route>
      <Route path="/users-deleted">
        <UserPage key="deletedUsers" status="deleted" showTool={true} />
      </Route>
      <Route path="/users-new">
        <UserPost />
      </Route>
      <Route path="/groups">
        <GroupPage key="allGroups" status="active" showTool={true} />
      </Route>
      <Route path="/groups-deleted">
        <GroupPage key="deletedGroups" status="deleted" showTool={true} />
      </Route>
      <Route path="/groups-new">
        <GroupView />
      </Route>

      <Route path="/applications">
        <ApplicationPage key="app" status="active" />
      </Route>
      <Route path="/applications-view">
        <ApplicationView key="appView" mode="view" />
      </Route>
      <Route path="/applications-new">
        <ApplicationPost key="appNew" mode="new" />
      </Route>

      <Route path="/apis">
        <ApiPage key="api" status="active" />
      </Route>
      <Route path="/apis-view">
        <ApiView key="apiView" mode="view" />
      </Route>
      <Route path="/apis-new">
        <ApiPost key="apiNew" mode="new" />
      </Route>
      <Route path="/error">
        <ErrorPage />
      </Route>
      <Route path="/login">
        <LogInPage />
      </Route>
      <Route path="/logout">
        <LogOutPage />
      </Route>

      <Route path="/">
        <LogInPage />
      </Route>
    </Switch>
  );
}

export default RoutesMain;
