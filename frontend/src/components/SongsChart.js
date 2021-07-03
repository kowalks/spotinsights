import React from 'react';

import Chart from './Chart';

const SongsChart = props => {
    return <Chart dataPoints = {props.data}/>;
};
export default SongsChart;