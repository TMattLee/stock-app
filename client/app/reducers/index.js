import { combineReducers } from 'redux';
import * as actions from '../actions/index.js';

var cloneDeep = require('clone-deep');

import { socket } from '../index.jsx';
const initialState ={
  isAuthorized:       false,
  done:               false,
  bars:               null,
  redirect:           false,
  message:            "",
  userDisplayName:    null,
  userId:             null,  
  showLoadingModal:   false,
  data:               [],
  dataLength:         0,
  validInput:         false,
  searchedForData:    false,
  chartDisplay:       'YEAR',
};

function currentState( state=initialState,actions ){
  let newData = [];
  switch( actions.type ){
    case 'CHECK_AUTH':
      return Object.assign( {}, state, {
        isAuthorized:       actions.isAuthorized,
        userDisplayName:    actions.userDisplayName,
        userId:             actions.userId,
      });
      
    case 'GET_DATA':
      if ( actions.data === "ERROR" ) {
        return Object.assign( {}, state, {
          done:             actions.done,
          message:          "There was an error. Please try a different symbol.",
        });
      }
      
      if ( actions.data === "NOT_FOUND"){
        return Object.assign( {}, state, {
          done:             actions.done,
          message:          "Symbol was not found. Please try another.",
        });
      }
      
      if ( actions.data === "API_ERROR"){
        return Object.assign( {}, state, {
          done:             actions.done,
          message:          "API ERROR Contact Administrator",
        });
      }
      
      if( state.data.length === 0 ){
        newData.push( actions.data );
        socket.emit('GOT_NEW_DATA',{
          data:               newData
        });
        return Object.assign( {}, state, {
          data:               newData,
          done:               actions.done,
          dataLength:         newData.length,
          message:            ""
        });
      }
      
      const testValue = actions.stock;
      for( let i = 0; i < state.data.length; i++ ){
        if( state.data[i].code === testValue ){
          return Object.assign( {}, state, {
            done:             actions.done,
            message:          "Symbol Already Used.",
          });
        }
      }
      
      let stockSymbol = actions.data.code;
      let stockPrices = Object.assign( [], actions.data.prices);
      
      const oldData = state.data;
      newData = cloneDeep( oldData )
      newData.push({
       code:              stockSymbol,
       prices:            stockPrices,
      });
      
      socket.emit('GOT_NEW_DATA',{
        data:               newData
      });
      
      return Object.assign( {}, state,{
        data:               newData,
        done:               actions.done,
        dataLength:         newData.length,
        message:            ""
      });

    case 'UPDATE_DATA':
      return Object.assign( {}, state, {
        data:               actions.data
      });
      
    case 'RESET_RESULTS':
      return Object.assign( {}, state, {
        bars:               actions.bars,
        addedBars:          actions.addedBars
      });
    
    case 'SET_DONE':
      return Object.assign( {}, state, {
        done:               actions.done,
      });
      
    case 'SET_NOT_DONE':
      return Object.assign( {}, state, {
        done:               actions.done,
      });
      
    case 'SHOW_MODAL':
      return Object.assign( {}, state, {
        showLoadingModal:   actions.bool,
      });
      
    case 'SIGN_OUT':
      return Object.assign( {}, state, initialState );
      
    case 'VALID_SYMBOL_INPUT':
      return Object.assign( {}, state, {
        validInput:         actions.bool
      })
    
    case 'REMOVE_SYMBOL':
      newData = cloneDeep( state.data, true );
      for( let i = 0; i < newData.length; i++ ){
        if( newData[i].code === actions.symbolCode ){
          const oldData = state.data;
          newData = cloneDeep( oldData )
          newData.splice( i, 1 );
          socket.emit('GOT_NEW_DATA',{
            data:               newData
          });
          return Object.assign( {}, state, {
            data:             newData
          })
        }
      }
      return state;
    
    case 'GET_CURRENT_DATA':
      return Object.assign( {}, state, {
        data:             actions.data.data,
        done:             actions.done,
        searchedForData:  actions.searchedForData,
      })
    
    case 'CHANGE_DISPLAY':
      return Object.assign( {}, state, {
        chartDisplay:     actions.displayValue
      })
    default:
      return state;
  }
} 

const reducers = combineReducers({
 currentState
});

export default reducers;