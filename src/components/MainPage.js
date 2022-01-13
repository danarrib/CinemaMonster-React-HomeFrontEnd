import React from 'react';
import PropTypes from 'prop-types';
import HomeMoviesList from './HomeMoviesList';
import HomeCinemasList from './HomeCinemasList';
import HomeGenreList from './HomeGenreList';
import { CContainer, CRow, CCol } from '@coreui/react';
import HomeAPI from '../services/HomeApi';
import Header from './Header';
import Footer from './Footer';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lstHomeGenres: [],
      lstHomeCinemas: [],
      lstHomeMovies: [],
    };
    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
  }

  componentDidMount() {
    this.getHomeData();
  }

  async getHomeData () {
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

    var apiRoute = 'Home';
    if(currentStateId != '0') {
      apiRoute += '/' + currentStateId;
      if(currentCityId != '0') {
        apiRoute += '/' + currentCityId;
      }
    }
    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      lstHomeGenres: response.data.featuredGenres,
      lstHomeCinemas: response.data.featuredCinemas,
      lstHomeMovies: response.data.featuredMovies,
    });
  }

  handleStateChanged(stateId) {
    
  }

  handleCityChanged(cityId) {
    this.getHomeData();
  }

  render() {
    return (
      <div data-testid="MainPage">
      <Header 
        onStateChange={stateId => this.handleStateChanged(stateId)} 
        onCityChange={cityId => this.handleCityChanged(cityId)} 
        />
        <CContainer className='mt-2 mb-2'>
          <CRow>
            <CCol>
              <h2>Featured Movies</h2>
              <HomeMoviesList movieslist={this.state.lstHomeMovies} />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <h2>Featured Cinemas</h2>
              <HomeCinemasList cinemaslist={this.state.lstHomeCinemas} />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <h2>Featured Genres</h2>
              <HomeGenreList genreslist={this.state.lstHomeGenres} />
            </CCol>
          </CRow>
        </CContainer>
      <Footer />
    </div>
  
    );
  }
}


MainPage.propTypes = {};

MainPage.defaultProps = {};

export default MainPage;
