import React from 'react'

export default class SearchSelector extends React.Component {

  render() {
    const { handleChange } = this.props

    return (
      <div>
        <h3>Search by:</h3>
        <select
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value='location'>Latitude + Longitude</option>
          <option value='city-name'>City Name</option>
        </select>
      </div>
    )
  }
}