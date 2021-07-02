import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from './Drawer'
import '../css/NavigationBar.css';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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

  const [logged, setData] = useState(false);
  const [profilepic, setpic] = useState("");
 

  const getPic = async () => {
    try{
      let response = await fetch('/spotify/profileimage')
      return response.json()
    }catch(error){
      console.log("Error to get pic");
    }
  }


  const check_Log = async () => {
    try{
      let response = await fetch('/spotify/is-authenticated')
      return response.json()
    }catch(error){
      console.log("Error to check log");
    }
  }

  useEffect( () => {
    if(logged == false || logged == undefined){
      check_Log().then((data) => setData(data.status));
    }
  }, [logged]);

  useEffect( () => {
    if(profilepic == ""){
      getPic().then((data) => setpic(data.url));
    }
  }, [profilepic]);


  const setButton = () => {
    if(logged == true){
      if(profilepic != "")
        return(
        <img className="LoginStyle" style={{borderRadius: 200, maxWidth: 64}} alt="complex" src={profilepic} />
          );
     return(
        <AccountCircleIcon className="LoginStyle" color="action" style={{ fontSize: 60 }}/>
     ); 
    }

    return(
      <Typography variant="h6" className={classes.title}>
        <Link to ='/' style={{ color: 'white', textDecoration: 'inherit'}}>SpotInsights</Link> 
        <Button variant="contained" color="secondary" onClick={props.bf} anchor="right" className="LoginStyle">
          Log In
        </Button>
      </Typography>
    );
  }



  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Drawer />
          <Typography variant="h6" className={classes.title}>
            <Link to ='/' style={{ color: 'white', textDecoration: 'inherit'}}>SpotInsights</Link> 
          </Typography>
              {setButton()}
        </Toolbar>
      </AppBar>
    </div>
  );
}
