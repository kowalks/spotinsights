import React, {useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import ArtistCard from '../../components/ArtistCard';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import TextCloud from '../../components/TextCloud';
import './styles.css';

export default function SpotStats() {
    const [data, setData] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [generalTypeData,setGeneralTypeData] = useState([]);
    let title = " SpotStats ";
    const loadArtistData = async () => {
        try{
            let artistResponse = await fetch('/spotify/top-artist');
            artistResponse = artistResponse.json().then(data => setData(data));
        }catch(error){
            console.log("problema no artistData ");
        }
    };
    const loadGeneralData = async () => {
        try{
            let generalDataResponse = await fetch('/spotify/audio-data');
            generalDataResponse = generalDataResponse.json().then(generalTypeData => setGeneralTypeData(generalTypeData));
        }catch(error){
            console.log("problema no GeneralData");
        }
    };
    const loadGenresData = async () => {
        try{
            let genreResponse = await fetch('/spotify/topgenres');
            genreResponse = genreResponse.json().then(genreData => setGenreData(genreData.genres));
        }catch(error){
            console.log("problema no GenreData");
        }
    };
    useEffect( () => {
        loadArtistData();
        loadGeneralData();
        loadGenresData()
    }, []);
    const listArtists = (dados) => {
        // console.log(dados);
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
            
            <React.Fragment >
                <GridList cellHeight={160} style={{maxWidth: 1150, overflowY: 'hidden' }} cols={5}>
                    {dados.map((teste,index)=> <ArtistCard data={dados[index]} key = {index}/>)}
                </GridList>
            </React.Fragment>
        );
    }
    const listGenres = (dados) => {
        // console.log(dados);
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
            
            <React.Fragment >
                <GridList cellHeight={160} style={{ overflowY: 'hidden' }} cols={5}>
                    {dados.map((teste,index)=> <Typography component="h5" 
                                                            alignCenter variant="h5"
                                                            className="genre-content"
                                                            key={index}>
                                                            {dados[index]}
                                                 </Typography>)}
                </GridList>
            </React.Fragment>
        );
    }
    return(
        <Container disableGutters = {true} className = "root" maxWidth={false} >
        <h1 className="style-title">{title}</h1>

        <Grid >
            <Typography component="div" id = "stats-component">
                <Typography variant="h3" component="h3" className = "top-artists-title"> Top Artistas </Typography>
                {listArtists(data)}
            </Typography>
        </Grid>
        <Grid >
            <Typography component="div" id = "stats-component">
                <Typography variant="h3" component="h3" 
                            style = {{/*backgroundColor: 'rgba(22, 29, 69,.3)'*/}} 
                            className = "top-artists-title"> General Data </Typography>
                <SongsChart data={generalTypeData}></SongsChart>
            </Typography>
        </Grid>
        <Grid >
            <Typography  component="div" id = "stats-component">
                <Typography  variant="h3" component="h3" className = "top-artists-title"> Gêneros Favoritos </Typography>
                {/* {listGenres(genreData)} */}
                <Grid style={{position: "relative", width:900,height: 550}}>
                    <TextCloud dados = {genreData}></TextCloud>
                </Grid>
            </Typography>
        </Grid>
        
        </Container>
        );
}

   