import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    // direction: "column",
    alignItems: "center",
    justifyContent: 'space-between',
    borderRadius: '30px',
    width: 250,
    height: 400,
    minWidth: 275,
    margin: '20px 20px',
    background: 'linear-gradient(to top, #003656 0%, #003656 40%, #ffc300 40%, #ffc300 100%)',
  },
  string: {
    fontSize: 24,
  },
  title: {
    fontSize: 36,
    marginTop: 10,
    marginBottom: 10,
  },
  pos: {
    marginBottom: 12,
  },
  img: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    // MarginBottom: 100,
    FontColor: '#003656',
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          {props.title}
        </Typography>
        <Typography className={classes.img} color="textPrimary" gutterBottom>
          {props.img}
        </Typography>
        <Typography variant="body2" component="p" className = {classes.string}>
          {props.string}
        </Typography>
      </CardContent>
      <CardActions className = {classes.button} >
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}