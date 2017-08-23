import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import styles from './Header.css';

import { loginAction } from '../../actions/index.js';
import { signOut } from '../../actions/index.js';


class Header extends Component {
  
  render(){
    const { props } = this;
    const { location, dispatch } = props;
    return(
      <div className={ styles.headerContainer } >
        <div className={ styles.headerContent } >
          <div className={ styles.headerContentLeft } > 
            
            <div className={ styles.tabStyle } >
              Stock Tracker
            </div>
            
          </div>
          <div className={ styles.headerContentRight }>
            
              <NavLink exact to="/stock-app/" 
                activeStyle={ activeStyle } 
                className={ styles.tabStyle } ></NavLink> 
          </div>
        </div>
      </div>
    );
  }
};

const activeStyle ={
  color:              '#222',
  textDecoration:     'none',
  textTransform:      'uppercase',
  margin:             '0px 2px',
  fontFamily:         '"Fira Sans", Helvetica, Arial, sans-serif',
  borderbottom:       '2px solid #222'
}


const mapStateToProps = ( state ) => ({
  done:               state.currentState.done,
  message:            state.currentState.message,
});

const mapDispatchToProps = ( dispatch ) => ({
  loginAction: ( location ) => dispatch( loginAction( location ) ),
  signOut: () => dispatch( signOut() ),
})
export default connect(
  mapStateToProps
)( Header );