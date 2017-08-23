import React  from 'react';
import { connect } from 'react-redux';
import { 
  VictoryChart,
  VictoryLine,
  VictoryTooltip,
  VictoryAxis,
  VictoryVoronoi,
  VictoryVoronoiContainer,
  VictoryLabel,
  createContainer,
} from 'victory-chart';

import randomColor from 'randomcolor';

import { changeDisplay } from '../../actions/index.js';

import styles from './StockChart.css';

class StockChart extends React.Component {
  constructor() {
    super();
    this.months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  }
  
  render(){
    
    if( this.props.data.length === 0){
      return <div></div>
    }
    
    let data = [];
    let lines = null;
    
    lines = this.props.data.map( ( value, key ) => {
      let lineData = []
      const newColor = randomColor();
      for ( let i = 0; i < value.prices.length; i++ ){
        let newObj = {
          x: new Date( value.prices[ i ][ 0 ] ),
          y: value.prices[ i ][ 1 ],
          l: newColor + '_' + value.code
        };
        lineData.push( newObj );
      }
      return <VictoryLine 
        data={ lineData } 
        style={{
          data:{
            stroke: newColor,
            strokeWidth: 2
          }
        }}
        key={ key } />
    })
    
    lines.reverse();
    
    const CustomTooltip = ( props ) => {
      const { x, y, datum, text } = props;
      const padding = 10;
      const tooltipData = text.map( ( value, key ) => {
        let transform0 = `translate(${ x + padding - 6 }, ${ 10*key + 15 })`;
        let transform1 = `translate(${ x + padding }, ${ 10*key + 20 })`;
        let transform2 = `translate(${ x + padding + 30 }, ${ 10*key + 20 })`;
        let valueArray = value.split(' ');
        let stockSymbolArr = valueArray[ 0 ].split('_');
        let stockSymbol = stockSymbolArr[ 1 ];
        let colorCode = stockSymbolArr[ 0 ];
        
        return <g key={ key }>
          <rect width="5" height="5" transform={ transform0 } style={ { fill: colorCode } } >
          
          </rect>
          <text transform={ transform1 } className={ styles.tooltipText } >
            { stockSymbol }
          </text>
          <text transform={ transform2 } className={ styles.tooltipText } >
            { valueArray[ 1 ] }
          </text>
        </g>
      })
      let transform = `translate(${ x + padding }, 10)`;
    	return <g>
    	  <rect x={ x } y={ 0 } width="125" height={ 15 + text.length * 10 }  className={ styles.rect } >
        </rect>
          <text transform={ transform } className={ styles.tooltipText } >
            { datum.x.toString().slice( 0, 15 ) }
          </text>
          {
            tooltipData 
          }
        <path d={`M${x},0 L${x},350`} style={{ strokeWidth: 1, stroke: 'lime' }} />
      </g>
    }
    
    const ZoomVoronoiContainer = createContainer( "zoom", "voronoi" );

    let currentDate = new Date();
    let endDate = new Date();
    endDate.setMonth( endDate.getMonth() - 1 );
     
    return (
      <div className={ styles.chart } >
        <VictoryChart height={ 400 } width={ 800 } scale= { { x: "time" } }
      	  containerComponent={
            <ZoomVoronoiContainer dimension="x"
              labels={(d) =>  `${d.l}: ${d.y}`  }
              labelComponent={ <CustomTooltip /> }
              minimumZoom={
                { x: 1000*60*60*24*5 }
              }
            />
          }
        >
          <VictoryAxis crossAxis dependentAxis 
            domain={ [ 0, 1200 ] } 
            offsetX={ 750 }
            tickFormat={
              ( y ) => {
                return `$ ${ y } `
              }
            }
            style={{
              axis: {
                stroke: "#eee",
                strokeWidth: '1px',
              },
              grid:{
                size: 500,
                stroke: '#aaa',
              },
              tickLabels:{ 
                fill: "#eee",
                fontSize: 10,
              }            
            }}
          />
          <VictoryAxis crossAxis
            style={{
              axis: {stroke: "#eee"},
              ticks:{
                size: -5,
                stroke: '#eee',
              },
              tickLabels:{ 
                fill: "#eee",
                fontSize: 10,
              }
            }}
            tickCount={ 12 }
          />
         
         {
          lines
         }
        </VictoryChart>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => ({
  data:               state.currentState.data,
  dataLength:         state.currentState.dataLength,
  chartDisplay:       state.currentState.chartDisplay,
})

const mapDispatchToProps = ( dispatch ) => ({
  changeDisplay: ( displayValue ) => dispatch( changeDisplay( displayValue ) ),
})

export default connect( mapStateToProps, mapDispatchToProps )( StockChart );