// import { Divider } from '@material-ui/core';

import React,{useState} from 'react';
import './ChartBar.css';

const ChartBar = props => {
  const [labelBar, setLabel] = useState(props.label)
  let barFillHeight = '0%';
  // useEffect( () => {
  //   loadData();
  // }, []);

  if (props.maxValue > 0) {
    barFillHeight = Math.round((props.value / props.maxValue) * 100) + '%';
  }
  const changeLabel = () =>{
    setLabel(barFillHeight);
    };
  const resetLabel = () =>{
    setLabel(props.label);
    };
  // const onHover = () => {labelBar =>  (barFillHeight);console.log(labelBar)};
  // const onNoHover = () => {labelBar => setData(props.label)};
    return (
        <div className='chart-bar'
        onMouseOver = {changeLabel}
        onMouseOut = {resetLabel}
        >
          <div className='chart-bar__inner'>
            <div
              className='chart-bar__fill'
              style={{ height: barFillHeight }}
            ></div>
          </div>
          <div className='chart-bar__label'>{labelBar}</div>
        </div>
      );
};
export default ChartBar;