import React from 'react';
import Container from '@material-ui/core/Container';
import SongsChart from '../../components/SongsChart';
import './styles.css';
import {XYPlot ,XAxis, YAxis, HorizontalGridLines,VerticalGridLines,VerticalBarSeries,HorizontalBarSeries} from 'react-vis'

export default function SpotStats() {
    const myData = [
        {"x": 10, "y": 'A','color': 'black'},
        {"x": 20, "y": 'B','color': 'orange'},
        {"x": 10, "y": 'C','color': 'red'},
        {"x": 30, "y": 'D','color': 'yellow'}
      ];
    return(
        <div>
            <h1>SpotStats</h1>
            <Container  className = 'algo'>
                <p>Hello World!</p> 
            </Container>
            <XYPlot
                yType={'ordinal'}
                width={450}
                height={300}>
                <HorizontalBarSeries 
                  data={myData}
                  onValueMouseOver={(d) => {console.log(d);}} 
                  colorType="literal"/>
                  <XAxis />
                  <YAxis />
              </XYPlot>
        </div>

    );
}