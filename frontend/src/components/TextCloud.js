import React, { Component,  useState,useEffect,useCallback,updateState} from 'react';
import randomColor from 'randomcolor';
import TagCloud from 'react-tag-cloud';
import { makeStyles } from '@material-ui/core/styles';
import './TextCloud.css'

const useStyles = makeStyles((theme) => ({
  large: {
    fontSize: 60,
    fontWeight: 'bold'
  },
  small: {
    opacity: 0.7,
    fontSize: 16
  }
}));


export default function cloudtext(props) {
    const classes = useStyles();
    const dados = props.dados;
    const createwords = (dados) => {
        // console.log(dados);
        if(dados.length == 0 || dados.length == undefined){
            return (
                <h1>Carregando...</h1>
            );
        }

        return(
                <TagCloud 
                    className='tag-cloud'
                    style={{
                        fontFamily: 'sans-serif',
                        fontSize: () => Math.round(Math.random() * 50) + 16,
                        // fontSize: 30,
                        color: () => randomColor({
                        hue: 'blue'
                        }),
                        padding: 5,
                    }}>
                        {dados.map((teste,index)=> <div key={index}>{dados[index]}</div>)}
                    </TagCloud>
        );
    }
    
    return (
    <div className='app-outer'>
        <div className='app-inner'>
            {createwords(dados)}
        </div>
    </div>
    );
}