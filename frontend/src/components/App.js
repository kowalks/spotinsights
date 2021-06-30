 import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { render } from "react-dom";
import Player from "./Player";

import '../global.css';
import Header from './Header';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import SpotStats from '../pages/SpotStats';
import FeatPath from '../pages/FeatPath';
import ReciboFy from '../pages/ReciboFy';
import NavigationBar from './NavigationBar';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyAuthenticated: false,
      song: {},
    };

    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    // this.getCurrentSong = this.getCurrentSong.bind(this);
  }

  componentDidMount() {
    // this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        this.setState({spotifyAuthenticated: data.status})
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data)=> {
              window.location.replace(data.url);
            })
        }
      });
  }

  getCurrentSong() {
    fetch('/spotify/current-song').then((response) => {
      if (!response.ok) {
        return {};
      } else {
        return response.json();
      }
    }).then((data) => {
      this.setState({song: data});
      // console.log(data);
    });
  }

  render() {
    return(
      <Grid item xs={12} align="center">
      
      <Router>
        <NavigationBar bf ={this.authenticateSpotify} />
 
        <Route exact path = '/'>      

          <LandingPage {...this.state.song}/>

        </Route>

        <Route exact path = '/spotStats'>
          <SpotStats/>
        </Route>

        <Route exact path = '/reciboFy'>
          <ReciboFy/>
        </Route>

        <Route exact path = '/featPath'>
          <FeatPath/>
        </Route>

      </Router>


        {/* <div className = "playerStyle">
          <Player {...this.state.song}/>
        </div> */}
      </Grid>
    );
  }
}


export default App;

const container = document.getElementById("app");
render(<App />, container);