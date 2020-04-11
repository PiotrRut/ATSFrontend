import React from "react";
import axios from 'axios';
import APIURL from "./misc/backend";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import authenticated from "./misc/userAuth";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      usertoken: null,
      userLoggedIn: false,
      userID: null,
      userRole: null,
      staffName: null,
      mongoID: null
    }

    // if there is a token currently in local localStorage
    // get it and set state and props for other components to access
    let webtoken = localStorage.getItem('usertoken')
    let parsedToken = JSON.parse(webtoken)
    if (authenticated()) {
      this.state.userLoggedIn = true
      this.state.usertoken = parsedToken.token
    }
  }

  // Load the user ID and update state from res
  async componentDidMount() {
    await axios.get(
      `${APIURL}/auth/profileInfo?secret_token=${this.state.usertoken}`)
      .then(res => {
        this.setState({
          userID: res.data.user.username,
          userRole: res.data.user.role,
          staffName: res.data.user.name,
          mongoID: res.data.user._id
        });
      });
  }

  render () {
    return (
      <Router>
      <Switch>
        <Route exact={true} path='/' render={() => (
          <div className="App">
            <NavBar userLoggedIn={this.state.userLoggedIn}
               staffName={this.state.staffName}
               staffRole={this.state.userRole}
             />
              {/* If logged in redirect to homepage and mount appropriate components, else display landing*/}
            {
              this.state.userLoggedIn
              ? <HomePage token={this.state.usertoken} staffRole={this.state.userRole} username={this.state.userID} mongoID={this.state.mongoID}/>
              : <LandingPage/>
            }
          </div>
        )}/>
      </Switch>
    </Router>
    )
  }
}

export default App;






