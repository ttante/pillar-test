import React from 'react'
import SearchSelector from './SearchSelector'
import SearchInputs from './SearchInputs'
import Results from './Results'
import { geolocated } from 'react-geolocated'

import axios from 'axios'
const localStorageCheck = 'testHasVisited'

const urlBase = 'https://api.openweathermap.org/data/2.5/weather?'
const urlTail = '&APPID=a0df8edc42f3dbaed0a667aa78e687ff'

// i used classes everywhere so that I wouldnt waste time converting
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
      console.log('fire')
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

    this.updateResults()
    localStorage.setItem(localStorageCheck, 'true')
  }


  updateResults() {
    const { coords } = this.props
    const { currentQuery, queryData } = this.state
    let queryString

    switch(currentQuery) {
      case 'city-name':
        queryString = `q=${queryData[currentQuery]},us`
        break
      case 'location':
      default:
        // this was a quick fix that i would separate out later
        queryString = `lat=${queryData.latitude || coords.latitude}&lon=${queryData.longitude || coords.longitude}`
        break
    }

    const url = `${urlBase}${queryString}${urlTail}`
    console.log('url: ', url)

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