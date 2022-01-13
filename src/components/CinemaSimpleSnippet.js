import React from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardImage, CCardBody, CCardText, CButton, CCardTitle } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

class CinemaSimpleSnippet extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(e) {
    e.preventDefault();
    this.props.navigate("/cinema/" + this.props.cinemaid);
  }

  render() {
    return (
      <div data-testid="CinemaSimpleSnippet">
        <CCard style={{ width: '18rem' }}>
        <CCardImage 
          orientation="top" 
          src={ this.props.cinemaimage === undefined ? "/images/react.jpg" : process.env.REACT_APP_ASSETS_URL + this.props.cinemaimage }
          />
          <CCardBody>
            <CCardTitle>{this.props.cinemaname}</CCardTitle>
            <CCardText>
              {this.props.cinemaaddress}, {this.props.cinemacityname}, {this.props.cinemastatename}
            </CCardText>
            <CButton 
            onClick={this.handleButtonClick}
            >Check out movies</CButton>
          </CCardBody>
        </CCard>
      </div>  
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <CinemaSimpleSnippet {...props} navigate={navigate} />
}

CinemaSimpleSnippet.propTypes = {};

CinemaSimpleSnippet.defaultProps = {};

export default WithNavigate;
