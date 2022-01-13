import React from 'react';
import PropTypes from 'prop-types';
import { CContainer, CRow, CCol, CButton } from '@coreui/react';
import Header from './Header';
import Footer from './Footer';
import Keycloak from 'keycloak-js';

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      keycloak: null, 
      authenticated: false,
      name: '',
      email: '',
      id: '',
     };

    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.redirectToLogout = this.redirectToLogout.bind(this);
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({
      //onLoad: 'login-required'
      onLoad: 'check-sso'
    }).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    });
  }

  handleStateChanged(stateId) {
    
  }

  handleCityChanged(cityId) {

  }

  redirectToLogin() {
    console.log('Login');
    this.state.keycloak.login();
  }

  redirectToLogout() {
    console.log('Logout');
    this.state.keycloak.logout();
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated) {
        this.state.keycloak.loadUserInfo().then(userInfo => {
          this.setState({name: userInfo.name, email: userInfo.email, id: userInfo.sub})
        });
  
        
        return (
          <div data-testid="UserDashboard">
            <Header 
              onStateChange={stateId => this.handleStateChanged(stateId)} 
              onCityChange={cityId => this.handleCityChanged(cityId)} 
              />
              <CContainer className='mt-2 mb-2'>
                <CRow>
                  <CCol>
                    <h2>User Dashboard</h2>
                    <p>This is a Keycloak-secured component of your application. You shouldn't be able
              to see this unless you've authenticated with Keycloak.</p>
                    <div className="UserInfo">
                      <p>Name: {this.state.name}</p>
                      <p>Email: {this.state.email}</p>
                      <p>ID: {this.state.id}</p>
                    </div>
                    <CButton onClick={this.redirectToLogout}>Logout</CButton>
                  </CCol>
                </CRow>
              </CContainer>
            <Footer />
          </div>
        );
      }
       else{
        return (
          <div data-testid="UserDashboard">
            <Header 
              onStateChange={stateId => this.handleStateChanged(stateId)} 
              onCityChange={cityId => this.handleCityChanged(cityId)} 
              />
              <CContainer className='mt-2 mb-2'>
                <CRow>
                  <CCol>
                    <h2>User not logged in</h2>
                    <CButton onClick={this.redirectToLogin}>Login</CButton>
                  </CCol>
                </CRow>
              </CContainer>
            <Footer />
          </div>
        )
  
       }
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}


UserDashboard.propTypes = {};

UserDashboard.defaultProps = {};

export default UserDashboard;
