import React, { useEffect, useState } from "react";
import './App.scss';
import axios from "axios";


// Pages
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import TimelinePage from "./pages/TimelinePage";
import ProfilePage from "./pages/ProfilePage";



// Dependencies
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("access_token") !== null)
  const [loggedUser, setLoggedUser] = useState(null)

  useEffect(()=>{
    async function getData(){
      if(isLoggedIn){
        const response = await axios.get(`http://localhost:9000/me`, {
          
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
        setLoggedUser(response.data)
      }
      
    }    
    getData();
  }, [isLoggedIn])
  
  return (
    <div>
      <Router>
        <Switch>
          <AuthenticatedRoute path="/" exact={true} isLoggedIn={isLoggedIn}>
            <TimelinePage loggedUser={loggedUser} />
          </AuthenticatedRoute>
          <Route path="/users/login">
            <LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <Route path="/users/signup">
            <SignUpPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  />
          </Route>
          <Route path="/:nickname">
            <ProfilePage loggedUser={loggedUser} />
          </Route> 
        </Switch>
      </Router>
      
    </div>
  );
}

function AuthenticatedRoute({ isLoggedIn, ...props}){
  if(isLoggedIn){
    return <Route {...props}/>
  } else{
    return <Redirect to="/users/login"/>
  }
}

export default App;
