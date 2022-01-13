import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import HomeAPI from '../services/HomeApi';
import Header from './Header';
import Footer from './Footer'
import { CContainer, CRow, CCol, CImage, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

class MoviePageClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieId: this.props.movieId,
      movieData: {},
      cinemasData: [],
      movieGenreName: "",
    };
    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.getMovieData();
    this.getCinemasPlayingData();
  }

  async getMovieData () {
    var apiRoute = 'Movie/' + this.state.movieId;
    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      movieData: response.data,
      movieGenreName: response.data.movieGenre.name,
    });
  }

  async getCinemasPlayingData () {
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

    var apiRoute = 'Cinema/byMovie/' + this.state.movieId;
    if(currentStateId !== '0') { apiRoute += '/' + currentStateId; }
    if(currentCityId !== '0') { apiRoute += '/' + currentCityId; }

    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      cinemasData: response.data,
    });
  }

  handleStateChanged(stateId) {
    this.getCinemasPlayingData();
  }

  handleCityChanged(cityId) {
    this.getCinemasPlayingData();
  }

  handleButtonClick(cinemaId) {
    this.props.navigate("/sessions/" + cinemaId + "/" + this.props.movieId);
  }

  render() {
    if(this.state.movieData.name === undefined) {
      return '';
    }
    
    const localCinemasData = this.state.cinemasData;
    const cinemas = localCinemasData.map((item, index) => {
      return (
        <CRow key={item.id}>
          <CCol>
            <strong>{item.name}</strong>
            <p>{item.address} - {item.city.name}, {item.city.state.name} </p>
          </CCol>
          <CCol>
            <CButton 
              onClick={this.handleButtonClick.bind(this, item.id)}
            >Buy tickets</CButton>
          </CCol>
        </CRow>
      );
    } );

    return (
      <div data-testid="MoviePage">
        <Header 
        onStateChange={stateId => this.handleStateChanged(stateId)} 
        onCityChange={cityId => this.handleCityChanged(cityId)} 
        />
        <CContainer className='mt-2 mb-2'>
          <CRow>
            <CCol md={3}>
              <CImage 
                src={ this.state.movieData.poster === undefined ? "/images/react.jpg" : process.env.REACT_APP_ASSETS_URL + this.state.movieData.poster }
                fluid rounded
                />
            </CCol>
            <CCol md={7}>
              <CContainer>
                <CRow>
                  <h2>{this.state.movieData.name }</h2>
                  <p><small>
                    Original name: {this.state.movieData.originalName } <br />
                    Genre: {this.state.movieGenreName } <br />
                    Duration: {this.state.movieData.durationMinutes } minutes</small></p>
                  <p>{this.state.movieData.synopsis }</p>
                </CRow>
                <CRow>
                  <h3>Cinemas playing this movie</h3>
                  <CContainer>
                    {cinemas}
                  </CContainer>

                </CRow>
              </CContainer>
            </CCol>
          </CRow>
        </CContainer>
      <Footer />
    </div>
  
    );
  }
}

export default function MoviePage() {
  let params = useParams();
  let navigate = useNavigate();
  return (
    <div data-testid="MoviePage">
      <MoviePageClass movieId={params.movieId} navigate={navigate} />
    </div>
  );
}
