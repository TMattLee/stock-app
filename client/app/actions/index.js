import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_NOT_DONE = 'SET_NOT_DONE';
export const SET_DONE = 'SET_DONE'

export const CHECK_AUTH = 'CHECK_AUTH';
export const SIGN_OUT = 'SIGN_OUT';

export const GET_DATA = 'GET_DATA';
export const RESET_RESULTS = 'RESET_RESULTS';

export const INITIALIZE_STATE = 'INITIALIZE_STATE';

export const VALID_SYMBOL_INPUT = 'VALID_SYMBOL_INPUT';
export const REMOVE_SYMBOL = 'REMOVE_SYMBOL';
export const UPDATE_DATA = 'UPDATE_DATA';
export const GET_CURRENT_DATA = 'GET_CURRENT_DATA';
export const CHANGE_DISPLAY = 'CHANGE_DISPLAY';

export const SHOW_MODAL = 'SHOW_MODAL';

export const getData = ( stock ) => {
  return ( dispatch ) => {
    axios({ 
      method: 'POST',
      url: '/stock-app/addstock',
      data:{
        stock: stock,
      }
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:   GET_DATA,
        data:   data,
        done:   true,
        stock:  stock.toUpperCase()
      })
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const resetResults = () => ({
  type: RESET_RESULTS,
  bars: null,
  addedBars: false,
})

export const showModal = ( bool ) => ({
  type: SHOW_MODAL,
  bool: bool,
})

export const setDone = () => ({
  type: SET_NOT_DONE,
  done: true,
})

export const setNotDone = () => ({
  type: SET_NOT_DONE,
  done: false,
})

export const getCurrentData = () =>{
  return ( dispatch ) => {
    axios({ 
      method: 'GET',
      url: '/stock-app/getcurrent',
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:             GET_CURRENT_DATA,
        data:             data,
        done:             true,
        searchedForData:  true,
      })
    })
    .catch( error => {
      console.log( '...' );
    });
  }
}

export const validSymbolInput = ( bool ) => ({
  type: VALID_SYMBOL_INPUT,
  bool: bool
})

export const removeSymbol = ( symbolCode ) => ({
  type: REMOVE_SYMBOL,
  symbolCode: symbolCode,
})

export const updateData = ( data ) => ({
  type: UPDATE_DATA,
  data: data
})

export const changeDisplay = ( displayValue ) => ({
  type: CHANGE_DISPLAY,
  displayValue: displayValue
})