import React from "react";
import './styles.css';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '../../components/Card';

const useStyles = makeStyles((theme) => ({
    titulo: {
        paddingTop: '20px',
        flexGrow: 1
    },
    subtitulo: {
        paddingBottom: '20px',
        flexGrow: 1,
        color: 'white'
    }
}));

const LandingPage = () => {
    const imgPath = "../static/img/";
    const classes = useStyles()
    return (
        <Container maxWidth="xl">
            <Typography     style={{ backgroundColor: '#001D3D', borderRadius: 14, color: "white" }}>
                <Grid style={{ marginTop: 10 }}>

                    <Typography  className={classes.subtitulo}>
                        
                        <Typography className={classes.titulo} variant="h2" component="h2">
                            Descubra mais sobre o seu gosto musical
                        </Typography>

                        Geramos resultados extraordinários a partir da Música. Entenda como a música te afeta, seus gêneros e soms favoritos!

                    </Typography>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="flex-end">
                    <Card
                        title="Spotstats"
                        string="Verifique sua estátistica musical em tempo real!"
                        img="../static/img/chart-icon.png"
                        longDescription="Quais são seus artistas mais ouvidos? Quais são seus gêneros favoritos? Qual a vibe do que você ouve? Confira no SpotStats"
                    />
                    <Card
                        title="ReciboFy"
                        string="Compartilhe seus resultados de uma forma criativa!"
                        img="../static/img/receipt-icon.png"
                        longDescription="Vai querer sua via?? O ReciboFy monta uma listinha para você com suas top 10 mais acessadas, com código de barras e tudo!"
                    />
                    <Card
                        title="FeatPath"
                        string="Crie Playlists Personalizadas Linkando artistas!"
                        img="../static/img/path-icon.png"
                        longDescription="Já pensou em conectar artistas através de suas músicas conjuntas? Com o FeatPath você consegue construir a menor playlist que se inicia em um artista e termina em outro."
                    />
                </Grid>
            </Typography>
        </Container>

    )
};


export default LandingPage;