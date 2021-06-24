import React from "react";
import './styles.css';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

const LandingPage = () =>{
    return(
 
    <Container maxWidth="xl">
     <Grid style={{marginTop: 10}}>
        <Typography component="div" style={{ backgroundColor: '#003656', borderRadius: 14, color: "white"}}>
            <Typography variant="h2" component="h2">
                Descubra mais sobre o seu gosto musical
            </Typography>
            Geramos resultados extraordinários a partir da Música. Entenda como a música te afeta, seus gêeros e soms favoritos!
      </Typography>
        </Grid>
    </Container>
        
    )
};


export default LandingPage;