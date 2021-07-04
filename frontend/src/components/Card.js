import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogButton from './DialogButton';

const useStyles = makeStyles({
  root: {
    borderRadius: '30px',
    width: 250,
    height: 400,
    minWidth: 275,
    margin: '20px 20px',
    position: 'relative',
    background: 'linear-gradient(to top, #003656 0%, #003656 40%, #ffc300 40%, #ffc300 100%)',
  },
  content: {
    position: 'relative',
    direction: "column",
    alignItems: "center",
    justifyContent: 'space-between',
    height: 350,
  },
  string: {
    minWidth: 200,
    left: '50%',
    transform: 'translateX(-50%)',
    position: 'absolute',
    top: '70%',
    fontSize: 20,
  },
  title: {
    fontSize: 36,
    marginTop: 10,
    marginBottom: 10,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    width: 100,
  },
  button: {
    // MarginBottom: 100,
    position: 'absolute',
    bottom: 0,
    FontColor: '#cee1e1',
    width: '100%', 
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          {props.title}
        </Typography>
        <CardMedia
          className={classes.media}
          image={props.img}
          title={classes.title}
        />
        <Typography variant="body2" component="p" className = {classes.string}>
          {props.string}
        </Typography>
      </CardContent>
      <CardActions className = {classes.button} >
        {/* <Button style = {{color: '#cee1e1'}} size="xl">Saiba Mais</Button> */}
        <DialogButton style = {{width: '100%'}} title = {props.title} content = {props.longDescription}></DialogButton>
      </CardActions>
    </Card>
  );
}