import React from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardImage, CCardBody, CCardText, CButton, CCardTitle } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

class MovieSimpleSnippet extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(e) {
    e.preventDefault();
    this.props.navigate("/movie/" + this.props.movieid);
  }

  render() {
    return (
      <div data-testid="MovieSimpleSnippet">
      <CCard style={{ width: '18rem' }}>
        <CCardImage 
        orientation="top" 
        src={ this.props.movieposter === undefined ? "/images/react.jpg" : process.env.REACT_APP_ASSETS_URL + this.props.movieposter }
        />
        <CCardBody>
          <CCardTitle>{ this.props.movietitle }</CCardTitle>
          <CCardText>
          { this.props.moviegenre }, { this.props.movieduration } minutes
          </CCardText>
          <CButton 
          onClick={this.handleButtonClick}
          >Buy tickets</CButton>
        </CCardBody>
      </CCard>
    </div>
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <MovieSimpleSnippet {...props} navigate={navigate} />
}

MovieSimpleSnippet.propTypes = {};

MovieSimpleSnippet.defaultProps = {};

export default WithNavigate;
