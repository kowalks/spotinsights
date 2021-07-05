import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 5,
  },
  paper: {
    padding: theme.spacing(2),
    position: "relative",
    margin: "auto",
    maxWidth: 200,
    borderRadius: '30px',
    maxHeight: 280,
    textAlign: "center",
    backgroundColor: "#242422",
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 170,
    height: 170,
    position: "center"
  },
  img: {
  borderRadius: '30px',
  display: 'block',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  height: '100%',
  //   marginTop: 10,
  //   marginBottom: 10,
  width: '100%',
  },
  string: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp:1,
    WebkitBoxOrient:'vertical',
    fontSize: 14,
    color: "white"
  },
  title: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  img: {
  borderRadius: '30px',
  display: 'block',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  height: '100%',
  //   marginTop: 10,
  //   marginBottom: 10,
  width: '100%',
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={props.data.img}/>
            </ButtonBase>
          </Grid>
            <Grid item xs>
                <Typography gutterBottom variant="overline" color="textPrimary" className={classes.string}>
                  {props.data.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom className={classes.string}>
                  {props.data.artists}
                </Typography>
            </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}