import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from './Drawer'
import '../css/NavigationBar.css';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#ffc300"
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Drawer />
          <Typography variant="h6" className={classes.title}>
            <Link to ='/' style={{ color: 'white', textDecoration: 'inherit'}}>SpotInsights</Link> 
      <Button variant="contained" color="secondary" onClick={props.bf} anchor="right" className="LoginStyle">
      Log In
      </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
