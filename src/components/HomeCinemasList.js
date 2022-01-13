import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol } from '@coreui/react';
import CinemaSimpleSnippet from './CinemaSimpleSnippet';

class HomeCinemasList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lstCinemas = this.props.cinemaslist;
    if(lstCinemas.length === 0) {
      return '';
    }

    const colCinemas = lstCinemas.map(function(cinema) {
      return (
        <CCol key={ cinema.id }>
          <CinemaSimpleSnippet 
            cinemaname={ cinema.name } 
            cinemaaddress={ cinema.address } 
            cinemacityname={ cinema.city.name } 
            cinemastatename={ cinema.city.state.name } 
            cinemaid={cinema.id}
            cinemaimage={ cinema.image } />
        </CCol>
      );
    });

    return (
      <div data-testid="HomeCinemasList">
        <CRow>
          {colCinemas}
        </CRow>
      </div>  
    );
  }
}

HomeCinemasList.propTypes = {};

HomeCinemasList.defaultProps = {};

export default HomeCinemasList;
