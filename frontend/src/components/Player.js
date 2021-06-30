import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
  }

  build(){
    const songProgress = (this.props.time / this.props.duration) * 100;

    if (this.props.title == undefined) {
      return (<div></div>);
    }

    return (
      <Card>
        <Grid container alignItems="center">
        <Grid container direction="row" justify="center" alignItems="center" xs={2}>
            <img src={this.props.image_url} height="30%" width="30%" />
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {this.props.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {this.props.artist}
            </Typography>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    );
  }
  
  render() {
    return this.build();  
  }
}