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
  const [metada, setMeta] = useState([]);
 
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
      check_Log().then((data) => {
        setData(data.status)
        setMeta(data.metadata)
      });
    }
  }, [logged]);

  const setButton = () => {
    if(logged == true){
        return(
          <React.Fragment>
            <Typography variant="h6" style={{marginRight: 10}}>
              {metada.name}
            </Typography>
            <img className="LoginStyle" style={{borderRadius: 200, maxWidth: 48}} alt="complex" src={metada.profile} />
          </React.Fragment>
        );
    }

    return(
      <Button variant="contained" color="secondary" onClick={props.bf} anchor="right" className="LoginStyle">
          Log In
      </Button>
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
