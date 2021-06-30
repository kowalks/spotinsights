import React from 'react';

import Chart from './Chart';

const SongsChart = props => {
    const chartDataPoints = [
        {label: 'musica #1', value: 10},
        {label: 'musica #2', value: 15},
        {label: 'musica #3', value: 27},
        {label: 'musica #4', value: 6},
        {label: 'musica #5', value: 13},
    ];
    return <Chart dataPoints = {chartDataPoints}/>;
};
export default SongsChart;