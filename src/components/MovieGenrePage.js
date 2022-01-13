import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import HomeAPI from '../services/HomeApi';
import Header from './Header';
import Footer from './Footer'
import HomeMoviesList from './HomeMoviesList';
import { CContainer, CRow, CCol } from '@coreui/react';
import { useNavigate } from 'react-router-dom';


class MovieGenrePageClass extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      genreId: this.props.genreId,
      genreName: 'Genre',
      lstMovies: [],
    };
    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.getMoviesPlayingData();
  }

  async getMoviesPlayingData () {
    var currentStateId = sessionStorage.getItem('currentStateId');
    var currentCityId = sessionStorage.getItem('currentCityId');
    
    if(currentStateId===null) {
      currentStateId = '0';
      sessionStorage.setItem('currentStateId', '0');
    }
    if(currentCityId===null) {
      currentCityId = '0';
      sessionStorage.setItem('currentCityId', '0');
    }

    var apiRoute = 'Movie/byGenre/' + this.state.genreId;
    if(currentStateId !== '0') { apiRoute += '/' + currentStateId; }
    if(currentCityId !== '0') { apiRoute += '/' + currentCityId; }

    const response = await HomeAPI.get(apiRoute);
    // Get first genre name (all results are from same genre)
    var genreName = 'Genre';
    if(response.data.length > 0) {
      genreName = response.data[0].movieGenre.name;
    }

    this.setState({ 
      lstMovies: response.data,
      genreName: genreName,
    });
  }

  handleStateChanged(stateId) {
    this.getMoviesPlayingData();
  }

  handleCityChanged(cityId) {
    this.getMoviesPlayingData();
  }

  handleButtonClick(movieId) {
    this.props.navigate("/movie/" + movieId);
  }

  render() {
    return (
      <div data-testid="MovieGenrePageClass">
        <Header 
        onStateChange={stateId => this.handleStateChanged(stateId)} 
        onCityChange={cityId => this.handleCityChanged(cityId)} 
        />
        <CContainer className='mt-2 mb-2'>
          <CRow>
            <CCol>
              <h2>{this.state.genreName} movies playing</h2>
              <HomeMoviesList movieslist={this.state.lstMovies} />
            </CCol>
          </CRow>
        </CContainer>
        <Footer />
      </div>
    );
  }


}



export default function MovieGenrePage() {
  let params = useParams();
  let navigate = useNavigate();
  return (
    <div data-testid="MovieGenrePage">
      <MovieGenrePageClass genreId={params.genreId} navigate={navigate} />
    </div>
  );
}
