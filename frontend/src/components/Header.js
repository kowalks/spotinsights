import React, { Component } from "react";
import '../css/Header.css';
import NavigationBar from './NavigationBar';
import {Grid} from "@material-ui/core";

export default class Header extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {

      return (
        <div>
            <NavigationBar/>
        </div>
      );

    }
  }
