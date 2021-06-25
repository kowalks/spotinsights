import React from 'react';
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import './styles.css';

export default function SpotStats() {
    return(
        <div>
            <h1>SpotStats</h1>
            <Container  className = 'algo'>
                <p>Hello World!</p> 
            </Container>
            <SongsChart /> 
        </div>
        
    );
}