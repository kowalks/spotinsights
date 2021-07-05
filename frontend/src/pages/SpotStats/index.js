import React, {useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import ArtistCard from '../../components/ArtistCard';
import Card from "../../components/Container";
import RecommendationsCard from "../../components/Recommendations";
import Genres from "../../components/GenresPaper";
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import './styles.css';

export default function SpotStats() {
    const [data, setData] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [generalTypeData,setGeneralTypeData] = useState([]);
    const [recommendationsData,setRecommendationsData] = useState([]);
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
            genreResponse = genreResponse.json().then(genreData => setGenreData(genreData));
        }catch(error){
            console.log("problema no GenreData");
        }
    };
    const loadRecommendationsData = async () => {
        try{
            let recommendationsResponse = await fetch('/spotify/recommendations');
            recommendationsResponse = recommendationsResponse.json().then(recommendationsData => setRecommendationsData(recommendationsData));
        }catch(error){
            console.log("problema no recommendationsData");
        }
    };
    useEffect( () => {
        loadArtistData();
        loadGeneralData();
        loadGenresData();
        loadRecommendationsData()
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
            
            <React.Fragment>
                <GridList cellHeight={160} style={{maxWidth: 1150, overflowY: 'hidden' }} cols={3}>
                    {dados.map((teste,index)=> <Genres data={genreData[index]} key = {index}/>)}
                </GridList>
            </React.Fragment>
        );
    }
    const listRecommendations = (dados) => {
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
            
            <React.Fragment>
                <GridList cellHeight={160} style={{maxWidth: 1150, overflowY: 'hidden' }} cols={5}>
                    {dados.map((teste,index)=> <RecommendationsCard data={recommendationsData[index]} key = {index}/>)}
                </GridList>
            </React.Fragment>
        );
    }
    return(
        <Container maxWidth="xl">
        <h1 className="style-title">{title}</h1>

        <Grid style={{marginTop: 10, marginBottom:20}} >
            <Typography component="div" className = "stats-component">
                <Typography variant="h3" component="h3" className = "top-artists-title"> Top Artistas </Typography>
                {listArtists(data)}
            </Typography>
        </Grid>
        <Grid style={{marginTop: 10, marginBottom:20}} >
            <Typography component="div" className = "stats-component">
                <Typography variant="h3" component="h3" className = "top-artists-title"> General Data </Typography>
                <SongsChart data={generalTypeData}></SongsChart>
            </Typography>
        </Grid>
        <Grid style={{marginTop: 10, marginBottom:20}} >
            <Typography component="div" className = "stats-component">
                <Typography variant="h3" component="h3" className = "top-artists-title"> Gêneros Favoritos </Typography>
                {listGenres(genreData)}
            </Typography>
        </Grid>
        <Grid style={{marginTop: 10, marginBottom:30}}>
            <Typography component="div" style={{ backgroundColor: '#5160b9', borderRadius: 14, color: "white"}}>
                <Typography variant="h2" component="h2"> Enjoou do seu repertório? Experimente: </Typography>
                {listRecommendations(recommendationsData)}
            </Typography>
        </Grid>


        </Container>
        );
}

   