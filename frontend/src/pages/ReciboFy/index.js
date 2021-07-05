import React, {useEffect, useState} from 'react';
import './styles.css';
import Card from "../../components/Container";
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import {FlipCard, Cont} from './flip'
import ButtonBase from "@material-ui/core/ButtonBase";
import Switch from '@material-ui/core/Switch';
// await fetch('/spotify/recibofy').then(response => response.json()).catch( (error) => {console.log("deu ruim")}).then(data => setData(data));

export default function ReciboFy() {
    //botões:
    let checked = [false, false, false]

    let title = " ReciboFy ";
    const [dataShort, setDataShort] = useState([]);
    const [dataMedium, setDataMedium] = useState([]);
    const [dataLong, setDataLong] = useState([]);

    // handleClick0(){
    //     checked[0] = true;
    // }
    // handleClick1(){
    //     checked[1] = true;
    // }
    // handleClick2(){
    //     checked[2] = true;
    }

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

    const list = (dados) => {
        
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        if(checked[0] == true){
            checked[0] = false
                console.log("oi")
            return(
                
                <React.Fragment>
                    <GridList  style={{maxWidth: 1150, overflowY: 'hidden' }} cols={2}>
                        {dados.map((teste,index)=> <Card data={dataShort[index]} key = {index}/>)}
                    </GridList>
                </React.Fragment>
            );
        }
        else if(checked[1] == true){
            checked[1] = false
            console.log("entrou")
            console.log("saiu")
            return(
                
                <React.Fragment>
                    <GridList  style={{maxWidth: 1150, overflowY: 'hidden' }} cols={2}>
                        {dados.map((teste,index)=> <Card data={dataMedium[index]} key = {index}/>)}
                    </GridList>
                </React.Fragment>
            );
        }
        else if(checked[2] == true){
            checked[2] = false
            console.log("Qqweqweqweq")
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
            <Typography component="div" style={{ backgroundColor: '#5160b9', borderRadius: 14, color: "white"}}>
                <Typography variant="h2" component="h2">
                {title}
                </Typography>
                <ButtonBase onClick={handleClick0} >0</ButtonBase>
                <ButtonBase onClick={handleClick1} >1</ButtonBase>
                <ButtonBase onClick={handleClick2} >2</ButtonBase>
                {checked[0]? list(dataShort): (checked[1]? list(dataMedium): (checked[2]? list(dataLong): list({})))}
            </Typography>
        </Grid>
        </Container>

    );
}