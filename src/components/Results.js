import React from 'react'
import { ColumnChart } from 'react-chartkick'
import 'chart.js'


export default class Results extends React.Component {
  render() {
    const kToF = (k) => {
      return ((k - 273.15) * (9/5) + 32)
    }
    const { queryResults } = this.props
    const { main } = queryResults
    return (
      <div>
        {queryResults && main &&
          <ColumnChart
            data={[
              ['High Temp', kToF(main.temp_max)],
              ['Temp', kToF(main.temp)],
              ['Low Temp', kToF(main.temp_min)],
              ['Humidity', main.humidity],
              ['Pressure Idx / 10', main.pressure / 10]
            ]}
          />
        }
      </div>
    )
  }
}