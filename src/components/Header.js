import React from 'react';
import PropTypes from 'prop-types';
import { CContainer, CCol } from '@coreui/react';
import StateCityFilter from './StateCityFilter';
import HeaderUserSnippet from './HeaderUserSnippet';
import { useNavigate } from 'react-router-dom';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick(e) {
    e.preventDefault();
    this.props.navigate("/");
  }

  render() {
    return(
      <div className="header" data-testid="Header">
        <CContainer>
            <CCol md={4}>
              <h1>
                <a href="/" className="text-decoration-none" onClick={this.handleTitleClick}>Cinema Monster</a>
              </h1>
            </CCol>
            <CCol md={5}>
              <StateCityFilter 
                onStateChange={this.props.onStateChange} 
                onCityChange={this.props.onCityChange}
                />
            </CCol>
            <CCol md={3}>
              <HeaderUserSnippet />
            </CCol>
        </CContainer>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <Header {...props} navigate={navigate} />
}


Header.propTypes = {};

Header.defaultProps = {};

export default WithNavigate;
