import React, {useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import ArtistCard from '../../components/ArtistCard';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import './styles.css';

export default function SpotStats() {
    const [data, setData] = useState([]);
    const [generalTypeData,setGeneralTypeData] = useState([]);
    //  const generalTypeData = [
    //     {'label': 'Happy', 'value': '67'},
    //     {'label':'Energy', 'value': '54'},
    //     {'label':'Danceable', 'value': '45'},
    //     {'label':'Acoustic', 'value': '34'},
    //     {'label':'Speech', 'value': '80'},
    //     {'label':'Instrumental', 'value': '12'},
    //     {'label':'Life', 'value': '60'}
    //     ];
    let title = " SpotStats ";
    const loadData = async () => {
        try{
            let artistResponse = await fetch('/spotify/top-artist');
            let generalDataResponse = await fetch('/spotify/audio-data');
            generalDataResponse = generalDataResponse.json().then(generalTypeData => setGeneralTypeData(generalTypeData));
            artistResponse = artistResponse.json().then(data => setData(data));
        }catch(error){
            console.log("deu ruim")
        }
    };
    useEffect( () => {
        loadData();
    }, []);
    const list = (dados) => {
        // console.log(dados);
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
            
            <React.Fragment >
                <GridList cellHeight={160} style={{maxWidth: 1150, overflowY: 'hidden' }} cols={5}>
                    {dados.map((teste,index)=> <ArtistCard data={data[index]} key = {index}/>)}
                </GridList>
            </React.Fragment>
        );
    }
    return(
        <Container maxWidth="xl">
        <h1 className="style-title">{title}</h1>

        <Grid style={{marginTop: 10, marginBottom:20}} >
            <Typography component="div" className = "top-artists">
                <Typography variant="h3" component="h3" className = "top-artists-title"> Top Artistas </Typography>
                {list(data)}
            </Typography>
        </Grid>
        <Grid style={{marginTop: 10, marginBottom:20}} >
            <Typography component="div" className = "top-artists">
                <Typography variant="h3" component="h3" className = "top-artists-title"> General Data </Typography>
                <SongsChart data={generalTypeData}></SongsChart>
            </Typography>
        </Grid>
        </Container>
        );
}

   