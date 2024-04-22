import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LogInPage } from "./pages/LogInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { FindMatchPage } from "./pages/FindMatchPage"; // Import the FindMatchPage component
import { PrivateRoute } from "./auth/PrivateRoute";

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/" exact>
          <UserInfoPage />
        </PrivateRoute>
        <Route path="/login">
          <LogInPage />
        </Route>
        <Route path="/signup">
          <SignUpPage />
        </Route>
        <PrivateRoute path="/find-match">
          {" "}
          {/* New route for the find match page */}
          <FindMatchPage />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
