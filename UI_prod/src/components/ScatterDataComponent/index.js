import React, { Component } from 'react'
import ReactChartkick, { ScatterChart } from 'react-chartkick';
import Chart from 'chart.js'
import aurinData from '../../Assets/data files/Output.json'
import $ from 'jquery';

ReactChartkick.addAdapter(Chart)


export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    render() {
        return (
            <div>
                <ScatterChart data={[[174.0, 80.0], [176.5, 82.3]]} xtitle="Size" ytitle="Population" />
            </div>
        )
    }
}
