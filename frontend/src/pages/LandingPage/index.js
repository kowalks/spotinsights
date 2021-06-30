import React from "react";
import './styles.css';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '../../components/Card';

const LandingPage = () =>{
    return(
 
    <Container maxWidth="xl">
     <Grid style={{marginTop: 10}}>
        <Typography component="div" style={{ backgroundColor: '#003656', borderRadius: 14, color: "white"}}>
            <Typography variant="h2" component="h2">
                Descubra mais sobre o seu gosto musical
            </Typography>
            Geramos resultados extraordinários a partir da Música. Entenda como a música te afeta, seus gêneros e soms favoritos!
        
        </Typography>
     </Grid>
     <Grid container direction="row" justify="center" alignItems="flex-end">
     <Card title = "Spotstats" string = "Verifique sua estátistica musical em tempo real!" img="[Inserir Imagem]"/>
     <Card title = "Recibofy" string = "Compartilhe seus resultados de uma forma criativa!" img="[Inserir Imagem]"/>
     <Card title = "FeatPath" string = "Crie Playlists Personalizadas Linkando artistas!" img="[Inserir Imagem]"/>
    </Grid>
    </Container>
        
    )
};


export default LandingPage;