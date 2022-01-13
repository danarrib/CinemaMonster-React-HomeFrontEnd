import React from 'react';
import PropTypes from 'prop-types';
import MovieSimpleSnippet from './MovieSimpleSnippet';
import { CRow, CCol } from '@coreui/react';

class HomeMoviesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lstMovies = this.props.movieslist;
    if(lstMovies.length === 0) {
      return '';
    }
    const colMovies = lstMovies.map(function(movie) {
      return (
        <CCol key={ movie.id }>
          <MovieSimpleSnippet 
            movietitle={ movie.name } 
            moviegenre={ movie.movieGenre.name } 
            movieduration={ movie.durationMinutes } 
            movieid={ movie.id } 
            movieposter={ movie.poster } />
        </CCol>
      );
    });
    return (
      <div data-testid="HomeMoviesList">
        <CRow>
          {colMovies}
        </CRow>
      </div>
    );
  }
}

HomeMoviesList.propTypes = {};

HomeMoviesList.defaultProps = {};

export default HomeMoviesList;
