import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ReactLoading from 'react-loading';

import StockChart from '../../components/StockChart/StockChart.jsx';
import SymbolList from '../../components/SymbolList/SymbolList.jsx';
import styles from './HomePage.css';

import { socket } from '../../index.jsx';

import * as actions from '../../actions/index.js';

const HomePage = ( props ) =>  {
  
  if( props.data.length === 0 && !props.searchedForData ){
    props.actions.showModal( true );
    props.actions.getCurrentData();
  }

  socket.on('RECEIVE_DATA', ( payload ) => {
    props.actions.updateData( payload.data );
  });
  
  const showLoadingModal = () => {
    props.actions.showModal( true );
    props.actions.setNotDone();
  }
  
  const hideLoadingModal = () => {
    props.actions.showModal( false );
  }
  
  const checkSymbols = ( event ) => {
    const inputString = event.target.value;
    let testValue = false;
    switch ( inputString.length ){
      case 1:
        testValue =/[a-zA-Z]/.test( inputString );
        break;
      case 2:
        testValue =/[a-zA-Z]{2}/.test( inputString );
        break;
      case 3:
        testValue =/[a-zA-Z]{3}/.test( inputString );
        break;
      case 4:
        testValue =/[a-zA-Z]{4}/.test( inputString );
        break;
    }
    props.actions.validSymbolInput( testValue );
  }
  
  const stockSubmit = ( event ) =>  {
    event.preventDefault();
    event.stopPropagation();
    const stock = event.target[0].value.toUpperCase();
    props.actions.resetResults();
    showLoadingModal();
    props.actions.getData( stock );
  }
  
  if( props.done ){
    hideLoadingModal()
  }
  
  return ( <div className={ styles.itemContainer } >
    <Modal 
      isOpen={ props.showLoadingModal } 
      contentLabel="Modal"
      onRequestClose={ hideLoadingModal } 
      shouldCloseOnOverlayClick={ false } 
      className={{
        base: styles.modalClass,
        afterOpen: styles.modalClassAfterOpen,
        beforeClose: styles.modalClassBeforeClose
      }}
      overlayClassName={{
        base: styles.modalOverlayClass,
        afterOpen: styles.modalOverlayClassAfterOpen,
        beforeClose: styles.modalOverlayClassBeforeClose,
      }}>
      
      <div>
        <ReactLoading type="cylon" color="#4389a7" height={ 200 } width={ 200 }  delay={ 100 } />
      </div>
    
    </Modal>
    
    <div className={ styles.containerSide } >
      <form onSubmit={ stockSubmit } encType="x-www-urlencode">
        <div  className={ styles.textForm } >
          Enter Symbol
        </div> 
        <input className={ styles.symbolInput } 
          type="text" 
          name="stock" 
          maxLength="4"
          onChange={ checkSymbols }
          required /> 
          {
            props.validInput ? 
              <button  className={ styles.button } type="submit"> GO </button>
              :
              <button  className={ styles.buttonInactive } > GO </button>
          }
          <div className={ styles.messageContainer } >
            <div className={ styles.message } >
              { props.message }
            </div>
          </div>
      </form>
      <SymbolList />
    </div>
    <div className={ styles.containerCenter } >
      <StockChart />
    </div>
    
  </div>
  );
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showLoadingModal:   state.currentState.showLoadingModal,
  data:               state.currentState.data,
  validInput:         state.currentState.validInput,
  searchedForData:    state.currentState.searchedForData,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( HomePage );