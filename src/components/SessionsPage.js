import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import HomeAPI from '../services/HomeApi';
import Header from './Header';
import Footer from './Footer'
import { CContainer, CRow, CCol, CImage, CButton, CTabContent, CNav, CNavItem, CNavLink, CTabPane, CBadge } from '@coreui/react';
import { useNavigate } from 'react-router-dom';


class SessionsPageClass extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cinemaId: this.props.cinemaId,
      movieId: this.props.movieId,
      movieData: {},
      cinemaData: {},
      sessionsData: [],
      sessionsDays: [],
      movieGenreName: '',
      activeTab: 0,
    };
    this.handleStateChanged = this.handleStateChanged.bind(this);
    this.handleCityChanged = this.handleCityChanged.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    this.getCinemaData();
    this.getMovieData();
    this.getSessionsData();
  }

  async getCinemaData () {
    var apiRoute = 'Cinema/' + this.state.cinemaId;
    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      cinemaData: response.data,
    });
  }

  async getMovieData () {
    var apiRoute = 'Movie/' + this.state.movieId;
    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      movieData: response.data,
      movieGenreName: response.data.movieGenre.name,
    });
  }

  async getSessionsData () {
    var apiRoute = 'MovieSession/nextSessions/' + this.state.cinemaId + '/' + this.state.movieId;

    const response = await HomeAPI.get(apiRoute);
    this.setState({ 
      sessionsData: response.data,
    });

    this.processSessionsData(response.data);

  }

  processSessionsData (responsedata) {
    // Get sessions days and break sessions by day
    /*
    var sampleObject = { 
      sessionDate: new Date(),
      auditoriums: [{
        auditorium: { objAuditoriumFromApi, },
        sessions: [{
          objSessionFromApi,
        }],
      },],
    }
    */

    var sessionsDays = [];
    var currentDateAuditoriums = { auditoriums: [], }
    var currentAuditoriumSessions = { sessions: [], }
    var lastDate = new Date(1, 1, 1);
    var lastAuditoriumId = 0;
    var justChangedDate = false;

    responsedata.forEach(function (item, index, array) {
      // Get only the Session Date
      var currentDate = new Date(item.scheduledDateTime);
      currentDate = new Date((currentDate.getFullYear()) + "-" + (currentDate.getMonth() + 1)+ "-" + (currentDate.getDate()));

      // Open new Day if it's different from the previous one
      if(lastDate.getTime() !== currentDate.getTime())
      {
        justChangedDate = true;
      }
      else{
        justChangedDate = false;
      }

      // Open new Auditorium if it's different from the previous one
      if(lastAuditoriumId !== item.auditorium.id || justChangedDate) {
        lastAuditoriumId = item.auditorium.id;

        if(currentAuditoriumSessions.sessions.length > 0) {
          currentDateAuditoriums.auditoriums.push(currentAuditoriumSessions);
        }

        currentAuditoriumSessions = { auditorium: item.auditorium, sessions: [], }
      }

      // Open new Day if it's different from the previous one
      if(justChangedDate)
      {
        lastDate = currentDate;

        if(currentDateAuditoriums.auditoriums.length > 0) {
          sessionsDays.push(currentDateAuditoriums);
        }

        currentDateAuditoriums = { sessionDate: currentDate, auditoriums: [], }
      }

      currentAuditoriumSessions.sessions.push(item);
    } );

    if(currentAuditoriumSessions.sessions.length > 0) {
      currentDateAuditoriums.auditoriums.push(currentAuditoriumSessions);
    }

    if(currentDateAuditoriums.auditoriums.length > 0) {
      sessionsDays.push(currentDateAuditoriums);
    }

    this.setState({ 
      sessionsDays: sessionsDays,
    });
  }

  handleStateChanged(stateId) {

  }

  handleCityChanged(cityId) {

  }

  handleButtonClick(sessionId) {
    this.props.navigate("/checkout/" + sessionId);
  }

  handleTabClick(tabIndex) {
    this.setState({ activeTab: tabIndex, });
  }

  getWeekDayName(weekday) {
    switch(weekday) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      default:
        return '';
    }
  }

  renderSessionsTabs(sessionDays) {
    var sessionsTabs = sessionDays.map((item, index) => {
      var dateStr = this.getWeekDayName(item.sessionDate.getDay())  + ' ' + (item.sessionDate.getMonth() + 1) + '/' + item.sessionDate.getDate();

      return (
        <CNavItem key={'tab_' + index}>
          <CNavLink
            href="#"
            active={this.state.activeTab === index}
            onClick={this.handleTabClick.bind(this, index)}
          >
            {dateStr}
          </CNavLink>
        </CNavItem>
      );
    });
    return sessionsTabs;
  }

  zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  renderSessionsPanels(sessionDays) {
    var sessionsTabContents = sessionDays.map((item, index) => {
      var currentDayAuditoriums = item.auditoriums.map((curAuditorium, index2) => {
        var currentAuditoriumSessions = curAuditorium.sessions.map((curSession, index3) => {
          var sessionDateTime = new Date(curSession.scheduledDateTime);
          var sessionTime = this.zeroPad(sessionDateTime.getHours(),2) + ':' + this.zeroPad(sessionDateTime.getMinutes(),2);
          var sessionSubType = (
            <CBadge color='info'>Subtitle</CBadge>
          );
          if(curSession.flg_Dubbed) {
            sessionSubType = (
              <CBadge color='warning'>Dubbed</CBadge>
            );
          }
          var session3D = (
            <CBadge color='secondary'>2D</CBadge>
          );
          if(curSession.flg_3D) {
            session3D = (
              <CBadge color='success'>3D</CBadge>
            );
          }

          return (
            <CRow className='p-1' key={'session_' + curSession.id}>
              <CCol>{sessionTime}</CCol>
              <CCol>{sessionSubType}</CCol>
              <CCol>{session3D}</CCol>
              <CCol>$ {curSession.ticketRetailPrice}</CCol>
              <CCol>
                <CButton>Buy tickets</CButton>
              </CCol>
            </CRow>
          );
        });

        return (
          <CContainer className='p-2' key={'auditorium_' + curAuditorium.auditorium.id}>
            <h5>{curAuditorium.auditorium.name} - {curAuditorium.auditorium.auditoriumType.name}</h5>
            {currentAuditoriumSessions}
          </CContainer>
        );
      });

      return (
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeTab === index} key={'panel_' + index}>
          {currentDayAuditoriums}
        </CTabPane>
      );
    });
    return sessionsTabContents;
  }

  render() {
    if(this.state.movieData.name === undefined) {
      return '';
    }
    // Render Sessions tabs
    var sessionsTabs = this.renderSessionsTabs(this.state.sessionsDays.slice());
    var sessionsTabContents = this.renderSessionsPanels(this.state.sessionsDays.slice());

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
                  <h3>Sessions on {this.state.cinemaData.name }</h3>
                  <CNav variant="tabs" role="tablist">
                    {sessionsTabs}
                  </CNav>
                  <CTabContent>
                    {sessionsTabContents}
                  </CTabContent>
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


export default function SessionsPage() {
  let params = useParams();
  let navigate = useNavigate();
  return (
    <div data-testid="SessionsPage">
      <SessionsPageClass cinemaId={params.cinemaId} movieId={params.movieId} navigate={navigate} />
    </div>
  );
}
