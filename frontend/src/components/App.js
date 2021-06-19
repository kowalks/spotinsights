import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyAuthenticated: false
    };

    this.authenticateSpotify = this.authenticateSpotify.bind(this);
  }

  componentDidMount() {

    // fetch("api/lead")
    //   .then(response => {
    //     if (response.status > 400) {
    //       return this.setState(() => {
    //         return { placeholder: "Something went wrong!" };
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     this.setState(() => {
    //       return {
    //         data,
    //         loaded: true
    //       };
    //     });
    //   });
  }

  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        this.setState({spotifyAuthenticated: data.status})
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data)=> {
              window.location.replace(data.url);
            })
        }
      });
  }

  render() {
    return(
        <div>
          <p>Teste</p>
          <button onClick={this.authenticateSpotify}>Log In</button>
        </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);