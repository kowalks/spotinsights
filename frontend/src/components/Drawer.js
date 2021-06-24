import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MenuIcon from '@material-ui/icons/Menu';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import DirectionsIcon from '@material-ui/icons/Directions';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const iconList = [<EqualizerIcon/>,<QueueMusicIcon/>, <DirectionsIcon/>];
  const pathList = ["spotStats", "reciboFy", "featPath"];

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >

      <List>
        {['SpotStats', 'Recibofy', 'feat. Path'].map((text, index) => (
          <ListItem button key={text} > 
            <Link  to = {pathList[index]} style={{ color: 'inherit', textDecoration: 'inherit', width: 'inherit'}}>
              <ListItemIcon> { 
                iconList[index]
              } 
              </ListItemIcon>
              <ListItemText primary={text} />
            </Link>
          </ListItem>
        ))}
      </List>

    </div>
  );

  const anchor = "left";

  return (
    <div>
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}> <MenuIcon style={{ color: "white" }}/> </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
      
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  );
}
