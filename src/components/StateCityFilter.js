import React from 'react';
import PropTypes from 'prop-types';
import { CForm, CCol, CFormSelect, CRow} from '@coreui/react';
import HomeAPI from '../services/HomeApi';

class StateCityFilter extends React.Component {
  constructor(props) {
    super(props);

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

    this.state = {
      lstStates: [],
      lstCities: [],
      currentStateId: currentStateId,
      currentCityId: currentCityId,
    }
    this.updateCitiesList = this.updateCitiesList.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  componentDidMount() {
    this.getCitiesAndStates();
  }

  async getCitiesAndStates() {
    // Only fetch Cities and States if session doesn't has this list yet.
    if(sessionStorage.getItem('lstCitiesAndStates') === null) {
      const response = await HomeAPI.get('City');
      sessionStorage.setItem('lstCitiesAndStates', JSON.stringify(response.data));
    }

    this.updateStatesList();
  }

  updateStatesList() {
    var locallstStates = [];
    var localArr = JSON.parse(sessionStorage.getItem('lstCitiesAndStates'));
    locallstStates.push({ label: '(States)', value: '0', });
    localArr.forEach(function (value) {
      var objState = { 
        label: value.state.name, 
        value: value.state.id,
      };

      if(!locallstStates.some(e => e.value == objState.value)){
        locallstStates.push(objState);
      }
    });

    var localLstCities = [];
    localLstCities.push({ label: '(Select a state)', value: '0', });

    // Check if there's a selected state and city
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

    // Updating states
    this.setState( { 
      lstStates: locallstStates, 
      lstCities: localLstCities, 
      currentStateId: currentStateId, 
      currentCityId: currentCityId, 
    }, function () {
      this.fillCitiesList(currentStateId);
    } );
  }

  fillCitiesList(localStateId) {
    var localLstCities = [];
    var currentCityExistsOnList = false;
    var currentStateChanged = false;

    var currentCityId = sessionStorage.getItem('currentCityId');
    if(currentCityId===null) {
      currentCityId = '0';
    }

    var currentStateId = sessionStorage.getItem('currentStateId');
    if(currentStateId===null) {
      currentStateId = '0';
    }

    if(currentStateId != localStateId) {
      currentStateChanged = true;
    }

    if(localStateId == '0') {
      localLstCities.push({ label: '(Select a state)', value: '0', });
    } else {
      var localArr = JSON.parse(sessionStorage.getItem('lstCitiesAndStates'));
      localLstCities.push({ label: '(Cities)', value: '0', });
      localArr.forEach(function (value) {
        if(value.state.id == localStateId) {
          var objCity = { 
            label: value.name, 
            value: value.id,
          };
  
          if(!localLstCities.includes(objCity)){
            localLstCities.push(objCity);
            if(objCity.value == currentCityId) {
              currentCityExistsOnList = true;
            }
          }
        }
      });
    }

    // We just filled cities list, so we need to check if the selected city 
    // is in the list, and reset it's selection if don't.
    if(currentStateChanged) {
      sessionStorage.setItem('currentStateId', localStateId);
    }

    if(currentCityExistsOnList === false) {
      currentCityId = '0';
      sessionStorage.setItem('currentCityId', currentCityId);
    }

    this.setState( { 
      lstCities: localLstCities, 
      currentStateId: localStateId, 
      currentCityId: currentCityId, 
    } );

    // Call External Events
    if(currentStateChanged) {
      this.props.onStateChange(localStateId);
    }
    
    if(currentCityExistsOnList === false) {
      this.props.onCityChange(currentCityId);
    }
  }

  updateCitiesList(event) {
    // We just changed the state. So fill the city
    var localStateId = event.target.value;
    this.fillCitiesList(localStateId);
  }

  changeCity(event) {
    // We just changed city.
    var localCityId = event.target.value;
    sessionStorage.setItem('currentCityId', localCityId);
    this.setState( { currentCityId: localCityId, } );
    this.props.onCityChange(localCityId);
  }

  render() {
    return(
      <div data-testid="StateCityFilter">
        <CForm>
          <CRow>
            <CCol>
              <CFormSelect
                aria-label='States'
                options={ this.state.lstStates }
                onChange={ this.updateCitiesList }
                value={this.state.currentStateId}
              />
            </CCol>
            <CCol>
              <CFormSelect
                aria-label='Cities'
                options={ this.state.lstCities }
                onChange={ this.changeCity }
                value={this.state.currentCityId}
              />
            </CCol>
          </CRow>
        </CForm>
      </div>  
    );
  }
}

StateCityFilter.propTypes = {};

StateCityFilter.defaultProps = {};

export default StateCityFilter;
