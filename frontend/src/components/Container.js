import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import StarIcon from '@material-ui/icons/Star';

import {FlipCard, Cont} from '../pages/ReciboFy/flip'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 5,
  },
  paper: {
    margin: 5,
    maxWidth: 500,
    position: "relative",
    backgroundColor: "#5160B9",
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  qrcode: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();
  let min = props.data.min.toString();
  let sec = props.data.sec.toString();
  if(props.data.min < 10)
    min = "0"+min;

  if(props.data.sec < 10)
    sec = "0" + sec;

  return (
    <React.Fragment>
      <Paper className={classes.paper} >
      <FlipCard style={{padding: "16px", backgroundColor: "white"}}>
        <Grid container spacing={2} className="front">
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} style={{borderRadius: 5}} alt="complex" src={props.data.img} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="colorTextPrimary" color="textPrimary">
                  {props.data.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {props.data.artists}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Position: {props.data.position}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {min}:{sec}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1"><StarIcon/>{props.data.rating}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid className = "back">
          <img className={classes.qrcode} style={{borderRadius: 200}} alt="complex" src={props.data.qrcode} />
        </Grid>
      </FlipCard>
      </Paper>
    </React.Fragment>
  );
}