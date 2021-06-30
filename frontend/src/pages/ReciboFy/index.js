import React, {useEffect, useState} from 'react';
import './styles.css';
import Card from "../../components/Container";
import {Grid} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';


export default function ReciboFy() {
    // let title = " ReciboFy ";
    const [title, setTitle] = useState("Recibofy");
    const [data, setData] = useState([]);
    const loadData = async () => {
        try{
            // await fetch('/spotify/top-tracks?limit=3');
            let response = await fetch('/spotify/top-tracks');
            response = response.json().then(data => setData(data));
        }catch(error){
            console.log("deu ruim")
        }

        // await fetch('/spotify/recibofy').then(response => response.json()).catch( (error) => {console.log("deu ruim")}).then(data => setData(data));
    }
    useEffect( () => {
        loadData();
        console.log("call")
    }, []);

    const list = (dados) => {
        
        if(dados.length == 0 || dados.length == undefined){
            return <h1>Carregando.</h1>
        }
        // console.log(data[0].name)
        console.log("entrou");
        console.log(data);
        return(
            
            <React.Fragment>
                {/* <CssBaseline /> */}
                {dados.map((teste,index)=> <Card data={data[index]} key = {index}/>)}
               
            </React.Fragment>
        );
    }

    console.log(data);
    return(
        <Container maxWidth="xl">
    <h1 className="styleTitle"></h1>

        <Grid style={{marginTop: 10}}>
        <Typography component="div" style={{ backgroundColor: '#003656', borderRadius: 14, color: "white", overflowY: "auto ", maxHeight: "85vh"}}>
        <Typography variant="h2" component="h2">
        {title}
        </Typography>
        {list(data)}

        </Typography>
        </Grid>
        </Container>

    );
}