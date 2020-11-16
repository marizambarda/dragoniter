import React from 'react';
import './App.scss';
import AppContextProvider, { useAppContext } from './AppContext';

// Pages
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import TimelinePage from './pages/TimelinePage';
import ProfilePage from './pages/ProfilePage';
import MentionsPage from './pages/MentionsPage';
import HashtagsPage from './pages/HashtagsPage';
import EditUserInformationsPage from './pages/EditUserInformationsPage';
import FollowingPage from './pages/FollowingPage';
import FollowersPage from './pages/FollowersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoadingIndicator from './components/LoadingIndicator';

// Dependencies
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

function AppRouter() {
  const { isLoadingLoggedUser } = useAppContext();
  return (
    <div>
      {isLoadingLoggedUser && <LoadingIndicator />}
      {!isLoadingLoggedUser && (
        <Router>
          <Switch>
            <AuthenticatedRoute path="/" exact={true}>
              <TimelinePage />
            </AuthenticatedRoute>
            <Route path="/users/login">
              <LoginPage />
            </Route>
            <Route path="/users/signup">
              <SignUpPage />
            </Route>
            <Route path="/forgotpassword">
              <ForgotPasswordPage />
            </Route>
            <AuthenticatedRoute path="/mentions">
              <MentionsPage />
            </AuthenticatedRoute>
            <Route path="/hashtags/:hashtag">
              <HashtagsPage />
            </Route>
            <AuthenticatedRoute path="/editprofile">
              <EditUserInformationsPage />
            </AuthenticatedRoute>
            <Route path="/:nickname/following">
              <FollowingPage />
            </Route>
            <Route path="/:nickname/followers">
              <FollowersPage />
            </Route>
            <Route path="/:nickname">
              <ProfilePage />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

function AuthenticatedRoute(props) {
  const { isLoggedIn } = useAppContext();
  if (isLoggedIn) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/users/login" />;
  }
}

export default App;
