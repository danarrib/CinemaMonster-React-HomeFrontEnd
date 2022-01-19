import React from 'react';
import PropTypes from 'prop-types';
import { CAvatar, CRow, CCol, CContainer, CNav, CNavLink, CNavItem } from '@coreui/react';
import Keycloak from 'keycloak-js';

class HeaderUserSnippet extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      keycloak: null, 
      authenticated: false,
      name: 'Guest',
      email: '',
      id: '',
      initials: 'G'
     };

    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.redirectToRegister = this.redirectToRegister.bind(this);
    this.redirectToLogout = this.redirectToLogout.bind(this);
    this.getInitials = this.getInitials.bind(this);
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    console.log('Iniciando autenticação');
    keycloak.init({
      //onLoad: 'login-required'
      onLoad: 'check-sso',
      checkLoginIframe: false,
    }).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated }, () => {
        console.log('Callback depois de setar state');
        
        keycloak.loadUserInfo().then(userInfo => {
          this.setState({
            name: userInfo.name, 
            email: userInfo.email, 
            id: userInfo.sub,
            initials: this.getInitials(userInfo.name),
          })
        });
        console.log('Pegou Userinfo');
      });
      console.log('Autenticado 1');
      if(authenticated) {
        
      }
    });
  }

  redirectToLogin() {
    console.log('Login');
    this.state.keycloak.login();
  }

  redirectToRegister() {
    console.log('Register');
    this.state.keycloak.register();
  }

  redirectToLogout() {
    console.log('Logout');
    this.state.keycloak.logout();
  }

  getInitials(name) {
    var arrName = name.split(' ');
    if(arrName.length > 0) {
      // Get first letter of first and last items
      var firstLetter = arrName[0].charAt(0);
      var lastLetter = arrName[arrName.length-1].charAt(0);
      return firstLetter+lastLetter;
    }
    return '';
  }

  renderNotLoggedIn() {
    return (
      <>
        <CNavItem>
          <CNavLink href='#' onClick={this.redirectToLogin}>Sign in</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href='#' onClick={this.redirectToRegister}>Register</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href='/dashboard'>
            <CAvatar color="secondary" textColor='white' size="lg">G</CAvatar>
          </CNavLink>
        </CNavItem>
      </>
    );
  }

  renderLoggedIn() {
    console.log('Renderizando Logado');
    return (
      <>
        <CNavItem>
          {this.state.name}
        </CNavItem>
        <CNavItem>
          <CNavLink href='#' onClick={this.redirectToLogout}>Logout</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href='/dashboard'>
            <CAvatar color="secondary" textColor='white' size="lg">{this.state.initials}</CAvatar>
          </CNavLink>
        </CNavItem>
      </>
    );
  }

  render() {
    var navBar = '';

    if (this.state.keycloak) {
      if (this.state.authenticated) {
        navBar = this.renderLoggedIn();
      }
      else {
        navBar = this.renderNotLoggedIn();
      }
    }
    else {
      navBar = this.renderNotLoggedIn();
    }

    return (
      <div data-testid="HeaderUserSnippet">
        <CContainer fluid>
          <CRow>
            <CCol>
              <CNav className='justify-content-end align-items-center'>
                {navBar}
              </CNav>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}

HeaderUserSnippet.propTypes = {};

HeaderUserSnippet.defaultProps = {};

export default HeaderUserSnippet;
