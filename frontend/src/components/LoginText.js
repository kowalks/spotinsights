import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Grid} from "@material-ui/core";
import Button from '@material-ui/core/Button';

export default function Login(props) {
  return (
    <React.Fragment>
        <Container maxWidth="xl">
    <h1 className="styleTitle"></h1>

        <Grid style={{marginTop: 10}}>
        <Typography component="div" style={{ backgroundColor: '#5160b9', borderRadius: 14, color: "white", overflowY: "auto ", maxHeight: "85vh"}}>
        <Typography variant="h2" component="h2">
        Faça o login, por favor.
        </Typography>
        <Button variant="contained" color="secondary" size="large" onClick={props.bf} style={{marginBottom: 20, marginTop: 20}}>
          Logar
        </Button>

        </Typography>
        </Grid>
        </Container>
    </React.Fragment>
  );
}