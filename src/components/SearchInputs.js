import React from 'react'

export default class SearchInputs extends React.Component {
  handleChange(evt) {
    const { updateQueryData } = this.props
    const { name, value } = evt.target
    updateQueryData(name, value)
  }

  render() {
    const { currentQuery, queryData } = this.props

    return (
      <div>
        { currentQuery === 'city-name' &&
          <input
            type="text"
            name="city-name"
            placeholder={queryData['city-name'] || 'City'}
            onChange={(e) => this.handleChange(e)}
          />
        }

        { currentQuery === 'location' &&
          <React.Fragment>
            <input
              type="text"
              name="latitude"
              placeholder={queryData.latitude || 'Latitude'}
              onChange={(e) => this.handleChange(e)}
            />
            <input
              type="text"
              name="longitude"
              placeholder={queryData.longitude || 'Longitude'}
              onChange={(e) => this.handleChange(e)}
            />
          </React.Fragment>
        }
      </div>
    )
  }
}