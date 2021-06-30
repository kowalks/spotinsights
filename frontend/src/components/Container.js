import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 5,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
    backgroundColor: "#424242",
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
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={props.data.img} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {props.data.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {props.data.artists}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Position: {props.data.position}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {min}:{sec}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1"><StarIcon/>{props.data.rating}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <img className={classes.img} alt="complex" src={props.data.qrcode} />
      </Paper>
    </div>
  );
}