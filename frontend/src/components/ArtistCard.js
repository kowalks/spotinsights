import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';
// import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';

import {FlipCard, Cont} from '../pages/ReciboFy/flip'

const useStyles = makeStyles({
    root: {
      borderRadius: '30px',
      width: 200,
      height: 200,
    //   minWidth: 200,
      margin: '15px 15px',
      position: 'relative',
      background: 'black',
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
  });
  
  export default function SimpleCard(props) {
    const classes = useStyles();
    return (
        <FlipCard className={classes.root}>
            <CardContent className="front "style={{height:"200px",width:"200px", padding:0 }}>
                <CardMedia
                    className={classes.img}
                    image={props.data.img}
                    title={props.data.name}
                />
            </CardContent>
            <CardContent variant="h1"className={"back"} style={{height:"200px",width:"200px", padding:0}}>
                <Typography className={classes.title} gutterBottom>
                    {props.data.name}
                </Typography>
                <Typography variant="h3" component="p" className = {classes.string}>
                    #{props.data.position}
                </Typography>

                <Typography variant="subtitle1" style={{color:'white'}}>
                  <StarIcon/> {props.data.rating}
                </Typography>
            </CardContent>
        </FlipCard>
      
    );
  }