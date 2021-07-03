import React, {useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import ArtistCard from '../../components/ArtistCard';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import './styles.css';
// import {XYPlot ,XAxis, YAxis, HorizontalGridLines,VerticalGridLines,VerticalBarSeries,HorizontalBarSeries} from 'react-vis'

export default function SpotStats() {
    const [data, setData] = useState([]);
    let title = " SpotStats ";
    const generalTypeData = [
        {'label': 'Happy', 'value': '67'},
        {'label':'Energy', 'value': '54'},
        {'label':'Danceable', 'value': '45'},
        {'label':'Acoustic', 'value': '34'}];
    const loadData = async () => {
        try{
            // await fetch('/spotify/top-tracks?limit=3');
            let response = await fetch('/spotify/top-artist');
            response = response.json().then(data => setData(data));
        }catch(error){
            console.log("deu ruim")
        }
    };
    useEffect( () => {
        loadData();
    }, []);
    const list = (dados) => {
        
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
            
            <React.Fragment>
                <GridList cellHeight={160} style={{maxWidth: 800}} cols={3}>
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


 // <div>
        //     <h1>SpotStats</h1>
        //     <Container  classy = 'algo'>
        //         <p>Hello World!</p> 
        //     </Container>
        //     <XYPlot
        //         yType={'ordinal'}
        //         width={450}
        //         height={300}>
        //         <HorizontalBarSeries 
        //           data={myData}
        //           onValueMouseOver={(d) => {console.log(d);}} 
        //           colorType="literal"/>
        //           <XAxis />
        //           <YAxis />
        //     </XYPlot>
        //     <Grid container direction="row" justify="center" alignItems="flex-end">
        //     <Card title = "Spotstats" string = "Verifique sua estátistica musical em tempo real!" img= "../static/img/chart-icon.png"/>
        //     <Card title = "Recibofy" string = "Compartilhe seus resultados de uma forma criativa!" img="../static/img/path-icon.png"/>
        //     <Card title = "FeatPath" string = "Crie Playlists Personalizadas Linkando artistas!" img="../static/img/receipt-icon.png"/>
        //     </Grid>
        // </div>




    // const myData = [
    //     {
    //         "name": "Saib",
    //         "position": 1,
    //         "rating": 64,
    //         "artist_id": "6N4HlHINMvoTyAL0yhBUCk",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Matuê",
    //         "position": 2,
    //         "rating": 75,
    //         "artist_id": "5nP8x4uEFjAAmDzwOEc9b8",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "The Weeknd",
    //         "position": 3,
    //         "rating": 96,
    //         "artist_id": "1Xyo4u8uXC1ZmMpatF05PJ",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Bee Gees",
    //         "position": 4,
    //         "rating": 80,
    //         "artist_id": "1LZEQNv7sE11VDY3SdxQeN",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Michael Kiwanuka",
    //         "position": 5,
    //         "rating": 70,
    //         "artist_id": "0bzfPKdbXL5ezYW2z3UGQj",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Pineapple StormTv",
    //         "position": 6,
    //         "rating": 76,
    //         "artist_id": "09U6hmCerKcIJrixubiBjm",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Post Malone",
    //         "position": 7,
    //         "rating": 92,
    //         "artist_id": "246dkjvS1zLTtiykXe5h60",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Costa Gold",
    //         "position": 8,
    //         "rating": 68,
    //         "artist_id": "7q1aEytv83jXNECmyaMhgn",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Pink Floyd",
    //         "position": 9,
    //         "rating": 83,
    //         "artist_id": "0k17h0D3J5VfsdmQ1iZtE9",
    //         "color": 'red'
    //     },
    //     {
    //         "name": "Teto",
    //         "position": 10,
    //         "rating": 70,
    //         "artist_id": "68YeXpLt3jB7JHQS5ZjMGo",
    //         "color": 'red'
    //     }
    // ];