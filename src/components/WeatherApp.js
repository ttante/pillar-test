import React from 'react'
import SearchSelector from './SearchSelector'
import SearchInputs from './SearchInputs'
import Results from './Results'
import { geolocated } from 'react-geolocated'

import axios from 'axios'
const localStorageCheck = 'testHasVisited'

const urlBase = 'https://api.openweathermap.org/data/2.5/weather?'
const urlTail = '&APPID=a0df8edc42f3dbaed0a667aa78e687ff'

class WeatherApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentQuery: '',
      queryData: {},
      queryError: '',
      queryResults: {},
      showingCurrLocation: false
    }
  }

  componentDidMount() {
    const visitedCheck = localStorage.getItem(localStorageCheck)
    if (!visitedCheck && this.props.coords) {
      this.loadInitialResultsFromCoords.bind(this)
    }
  }

  componentDidUpdate(prevProps) {
    const { coords, isGeolocationEnabled } = this.props

    if (!prevProps.isGeolocationEnabled && isGeolocationEnabled) {
      this.loadInitialResultsFromCoords()
    } else if (prevProps.coords === null && coords !== null) {
      this.loadInitialResultsFromCoords()
    }
  }

  loadInitialResultsFromCoords() {
    const { latitude, longitude } = this.props
    this.setState({
      currentQuery: 'location',
      queryData: {
        latitude,
        longitude
      },
      showingCurrLocation: true
    })

    this.updateResults.bind(this, true)
    localStorage.setItem(localStorageCheck, 'true')
  }


  updateResults(initLocationUse = false) {
    const { currentQuery, queryData } = this.state
    let queryString

    if (!initLocationUse) {
      this.setState({ showingCurrLocation: false })
    }

    switch(currentQuery) {
      case 'city-name':
        queryString = `q=${queryData[currentQuery]},us`
        break
      case 'location':
        queryString = `lat=${queryData.latitude}&lon=${queryData.longitude}`
        break
      default:
        break
    }

    const url = `${urlBase}${queryString}${urlTail}`

    axios.get(url)
      .then(res => {
        console.log('res: ', res)
        this.setState({
          queryResults: res.data
        })

        if (this.state.queryError) {
          this.setState({ queryError: '' })
        }
      })
      .catch(queryError => {
        this.setState({
          queryError
        })
      })
  }

  updateQueryData(name, data) {
    this.setState({ queryData: {
      ...this.state.queryData,
      [name]: data
    }})
  }

  updateQueryType(queryType) {
    this.setState({ currentQuery: queryType })
  }

  render() {
    const { currentQuery, queryData, queryError, queryResults, showingCurrLocation } = this.state

    return(
      <div>
        <SearchSelector
          handleChange={this.updateQueryType.bind(this)}
        />
        <SearchInputs
          currentQuery={currentQuery}
          queryData={queryData}
          updateQueryData={this.updateQueryData.bind(this)}
        />
        <button
          onClick={this.updateResults.bind(this)}
        >
          Search
        </button>
        { queryError &&
          <div>There was a problem with that, try again</div>
        }
        <Results
          queryResults={queryResults}
          showingCurrLocation={showingCurrLocation}
        />
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(WeatherApp)