import React, {useEffect, useState} from 'react';
import './styles.css';
import Card from "../../components/Container";
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import {FlipCard, Cont} from './flip'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch';

export default function ReciboFy() {
    //botões:
    // let checked = [true, false, false]
    const [checked,setChecked] = useState([true, false, false])
    let title = " ReciboFy ";
    const [dataShort, setDataShort] = useState([]);
    const [dataMedium, setDataMedium] = useState([]);
    const [dataLong, setDataLong] = useState([]);

    const loadData = async () => {
        try{
            // await fetch('/spotify/top-tracks?limit=3');
            let response = await fetch('/spotify/top-tracks?time_range=short_term');
            response = response.json().then(dataShort => setDataShort(dataShort));
        }catch(error){
            console.log("deu ruim")
        }
        try{
            // await fetch('/spotify/top-tracks?limit=3');
            let response = await fetch('/spotify/top-tracks?time_range=medium_term');
            response = response.json().then(dataMedium => setDataMedium(dataMedium));
        }catch(error){
            console.log("deu ruim")
        }
        try{
            // await fetch('/spotify/top-tracks?limit=3');
            let response = await fetch('/spotify/top-tracks?time_range=long_term');
            response = response.json().then(dataLong => setDataLong(dataLong));
        }catch(error){
            console.log("deu ruim")
        }
    }

    useEffect( () => {
        loadData();
    }, []);

    const createPlaylist = async (timeRange) => {
        try{
            let response = await fetch('/spotify/recibofy?time_range='+timeRange,{
                method: 'POST'
            });
            let newValue = () => {
                return(
                    <Button variant="contained" disabled>
                        Playlist Criada
                    </Button>
                );
            }
            setText(newValue)
            // response = response.json().then(data => setData(data));
        }catch(error){
            console.log("deu ruim - createPlaylist")
        }
    }
    let value = (timeRange) => {
        return (
            <Button variant="contained" color="secondary" onClick={() =>{createPlaylist(timeRange) } }>
                        Criar Playlist
            </Button>
        );
    }

const [textButton, setText] = useState(value('short_term'));

    const list = (dados) => {
        
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        else if(checked[0] == true){
            return(
                
                <React.Fragment>
                    <GridList  style={{maxWidth: 1150, overflowY: 'hidden' }} cols={2}>
                        {dados.map((teste,index)=> <Card data={dataShort[index]} key = {index}/>)}
                    </GridList>
                </React.Fragment>
            );
        }

        else if(checked[1] == true){
            return(
                
                <React.Fragment>
                    <GridList  style={{maxWidth: 1150, overflowY: 'hidden' }} cols={2}>
                        {dados.map((teste,index)=> <Card data={dataMedium[index]} key = {index}/>)}
                    </GridList>
                </React.Fragment>
            );
        }

        else if(checked[2] == true){
            return(
                
                <React.Fragment>
                    <GridList  style={{maxWidth: 1150, overflowY: 'hidden' }} cols={2}>
                        {dados.map((teste,index)=> <Card data={dataLong[index]} key = {index}/>)}
                    </GridList>
                </React.Fragment>
            );
        }
    }

    return(
        <Container maxWidth="xl">
    <h1 className="styleTitle"></h1>
        <Grid style={{marginTop: 10}}>
            <Typography component="div" style={{ backgroundColor: '#5160b9', borderRadius: 14, color: "secondary"}}>
                <Typography variant="h2" component="h2" style={{color:"white"}}>
                {title}
                </Typography>
                <Typography variant="h2" component="h2">
                {textButton}
                </Typography>
                <Button   variant="contained" size = "large" style = {{ minWidth:'150px' ,margin:'0 10px'}} onClick={() => { setChecked([true,false,false]); setText(value('short_term'))}} > 30 Dias </Button>
                <Button   variant="contained" size = "large" style = {{ minWidth:'150px' ,margin:'0 10px'}} onClick={() => { setChecked([false,true,false]); setText(value('medium_term') )}} > 6 Meses</Button>
                <Button   variant="contained" size = "large" style = {{ minWidth:'150px' ,margin:'0 10px'}} onClick={() => { setChecked([false,false,true]); setText(value('long_term') ) }} > Desde o Início</Button>
                {checked[0]? list(dataShort): (checked[1]? list(dataMedium): (checked[2]? list(dataLong): list({})))}
            </Typography>
        </Grid>
        </Container>

    );
}