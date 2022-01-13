import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import HomeAPI from '../services/HomeApi';
import Header from './Header';
import Footer from './Footer'
import { CContainer, CRow, CCol, CImage, CButton, CCard, CCardBody, CCardTitle, CCardText, CCardImage } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

class CinemaPageClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cinemaId: this.props.cinemaId,
      cinemaData: {},
      moviesData: [],
    };
    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.getCinemaData();
    this.getMoviesPlayingData();
  }

  async getCinemaData () {
    var apiRoute = 'Cinema/' + this.state.cinemaId;
    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      cinemaData: response.data,
    });
  }

  async getMoviesPlayingData () {
    var apiRoute = 'Movie/byCinema/' + this.state.cinemaId;

    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      moviesData: response.data,
    });
  }

  handleStateChanged(stateId) {
    this.getMoviesPlayingData();
  }

  handleCityChanged(cityId) {
    this.getMoviesPlayingData();
  }

  handleButtonClick(movieId) {
    this.props.navigate("/sessions/" + this.props.cinemaId + "/" + movieId);
  }


  render() {
    const localMoviesData = this.state.moviesData;
    const movies = localMoviesData.map((item, index) => {
      return (
        <CRow key={item.id} className='m-2'>
          <CCard>
            <CRow>
              <CCol md={3}>
                <CCardImage 
                  orientation="top" 
                  src={ item.poster === undefined ? "/images/react.jpg" : process.env.REACT_APP_ASSETS_URL + item.poster }
                  />
              </CCol>
              <CCol md={9}>
                <CCardBody>
                  <CCardTitle>
                    {item.name}
                  </CCardTitle>
                  <CCardText>
                      Original name: {item.originalName}<br />
                      Genre: {item.movieGenre.name}<br />
                      Duration: {item.durationMinutes} minutes<br /><br />

                    <CButton 
                      onClick={this.handleButtonClick.bind(this, item.id)}
                    >Buy tickets</CButton>
                  </CCardText>

                </CCardBody>
              </CCol>
            </CRow>
          </CCard>
        </CRow>
      );
    } );

    var cinemaCity = '';
    var cinemaState = '';

    if(this.state.cinemaData.city) {
      cinemaCity = this.state.cinemaData.city.name;
      cinemaState = this.state.cinemaData.city.state.name;
    }

    return (
      <div data-testid="CinemaPageClass">
        <Header 
        onStateChange={stateId => this.handleStateChanged(stateId)} 
        onCityChange={cityId => this.handleCityChanged(cityId)} 
        />
        <CContainer className='mt-2 mb-2'>
          <CRow>
            <CCol md={3}>
              <CImage 
                src={ this.state.cinemaData.image === undefined ? "/images/react.jpg" : process.env.REACT_APP_ASSETS_URL + this.state.cinemaData.image }
                fluid rounded
                />
            </CCol>
            <CCol md={7}>
              <CContainer fluid>
                <CRow>
                  <CCol>
                  <h2>{this.state.cinemaData.name }</h2>
                  <p>{this.state.cinemaData.address } - {cinemaCity}, {cinemaState}</p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <h3>Movies playing on this cinema</h3>
                  </CCol>
                </CRow>
                {movies}
              </CContainer>
            </CCol>
          </CRow>
        </CContainer>
      <Footer />
    </div>
  
    );
  }

}

export default function CinemaPage() {
  let params = useParams();
  let navigate = useNavigate();
  return (
    <div data-testid="CinemaPage">
      <CinemaPageClass cinemaId={params.cinemaId} navigate={navigate} />
    </div>
  );
}

