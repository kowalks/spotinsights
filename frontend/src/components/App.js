 import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { render } from "react-dom";
import Player from "./Player";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyAuthenticated: false,
      song: {}
    };

    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 5000);
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
      console.log(data);
    });
  }

  render() {
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            SpotInsights
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.authenticateSpotify}>
            Log In
          </Button>
        </Grid>
        <Player {...this.state.song} />
      </Grid>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);