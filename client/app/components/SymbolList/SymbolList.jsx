import React  from 'react';
import { connect } from 'react-redux';

import { 
  removeSymbol
} from '../../actions/index.js';

import styles from './SymbolList.css';

const SymbolList = ( props ) => {
  if( !props.data ) return <div className={ styles.symbolContainer } ></div>
  
  const handleClick = ( event ) => {
    event.preventDefault();
    const symbolCode = event.target.getAttribute('name');
    props.removeSymbol( symbolCode );
  }
  
  const symbolList = props.data.map( ( value, key ) => {
    return <div className={ styles.symbolContainer } key={ key } >
      <div className={ styles.symbolText }>
        { value.code }
      </div>
      <img src="dist/assets/images/delete.png" 
        name={ value.code }
        className={ styles.imgX } 
        onClick={ handleClick } />
    </div>
  })
  
  return <div className={ styles.symbolList} >
    {
      symbolList
    }
  </div>
}
const mapStateToProps = ( state ) => ({
  data:               state.currentState.data,
  dataLength:         state.currentState.dataLength,
})

const mapDispatchToProps = ( dispatch ) => ({
  removeSymbol:       ( symbolCode ) => dispatch( removeSymbol( symbolCode ) ),
})

export default connect( 
  mapStateToProps, 
  mapDispatchToProps 
)( SymbolList );