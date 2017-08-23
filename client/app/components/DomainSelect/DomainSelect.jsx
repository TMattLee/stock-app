import React from 'react';
import { connect } from 'react-redux';

import { changeDisplay } from '../../actions/index.js';
import styles from './DomainSelect.css';

const DomainSelect = ( props ) => {
  const setDisplay = ( displayValue ) => {
    props.changeDisplay( displayValue );
  }
  
  return <div className={ styles.domainContainer } >
    <div className={ props.chartDisplay === 'YEAR' ? styles.domainButtonActive : styles.domainButton } 
      onClick={ setDisplay.bind( this, 'YEAR') } >
      Year
    </div>
    <div className={ props.chartDisplay === 'MONTH' ? styles.domainButtonActive : styles.domainButton } 
      onClick={ setDisplay.bind( this, 'MONTH') } >
      Month
    </div>
    <div className={ props.chartDisplay === 'WEEK' ? styles.domainButtonActive : styles.domainButton } 
      onClick={ setDisplay.bind( this, 'WEEK') } >
      Week
    </div>
    <div className={ props.chartDisplay === 'DAY' ? styles.domainButtonActive : styles.domainButton } 
      onClick={ setDisplay.bind( this, 'DAY') } >
      1 Day
    </div>
  </div>
}

const mapStateToProps = ( state ) => ({
  chartDisplay: state.currentState.chartDisplay,
})

const mapDispatchToProps = ( dispatch ) => ({
  changeDisplay: ( displayValue ) => dispatch( changeDisplay( displayValue ) ),
})

export default connect( mapStateToProps, mapDispatchToProps )( DomainSelect );