import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    position: "relative",
    margin: "auto",
    borderRadius: '20px',
    height: 60,
    width: 300,
    textAlign: "relative",
    backgroundColor: "#242422",
    marginTop: 10,
    marginBottom: 10,
  },
  string: {
    position: 'relative',
    fontSize: 16,
    color: "white",
    fontWeight: 'bold'
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Grid container spacing={0}>
            <Grid item xs>
                <Typography gutterBottom variant="overline" color="textPrimary" className={classes.string}>
                  {props.data.genre}
                </Typography>
            </Grid>
        </Grid>
    </Paper>
    </React.Fragment>
  );
}