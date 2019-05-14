import React, { Component } from 'react'
import aurinData from '../../Assets/data files/Output.json'
import $ from 'jquery';
import { Paper } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class AnalysisDataContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allNegativeSentiments: 0,
            allPositiveSentiments: 0,
            allNeutralSentiments: 0,
            displayData: this.props.isMarkerClicked,
            aurinCity: '',
            aurinDataObese: 0.0,
            aurinDataOverWeight: 0.0,
            aurinDataOverWeight: 0.0,
            aurinDataPhyInac: 0.0,
            aurinDataSmokers: 0.0
        }

    }

    updateData = () => {
        if (this.props.selectedMarker) {
            let allNeutralSentimentsConter = 0;
            let allNegativeSentimentsCounter = 0;
            let allPositiveSentimentsCounter = 0;
            this.props.selectedMarker.data.map((data, index) => {
                if (this.props.city === data.city && data.sentiment === "0") {
                    allNeutralSentimentsConter += data.sentimentValue
                    this.setState({
                        allNeutralSentiments: allNeutralSentimentsConter
                    })
                }
                else if (this.props.city === data.city && data.sentiment === "-1") {
                    allNegativeSentimentsCounter += data.sentimentValue;
                    this.setState({
                        allNegativeSentiments: allNegativeSentimentsCounter
                    })
                }
                else if (this.props.city === data.city && data.sentiment === "1") {
                    allPositiveSentimentsCounter += data.sentimentValue;
                    this.setState({
                        allPositiveSentiments: allPositiveSentimentsCounter
                    })
                }
            })
        }
    }

   

    getAurinData = () => {
        let selectedCity = this.props.city
        for (let index = 0; index < aurinData.length; index++) {
            if (selectedCity === aurinData[index].City) {
                this.setState({
                    aurinCity: aurinData[index].City,
                    aurinDataObese: aurinData[index].Obese,
                    aurinDataOverWeight: aurinData[index].OverWeight,
                    aurinDataPhyInac: aurinData[index].PhyInac,
                    aurinDataSmokers: aurinData[index].Smokers
                })

            }

        }
    }

    componentWillReceiveProps(prev, next) {
        this.updateData()
        this.getAurinData()
    }

    componentWillMount() {
        this.getAurinData()
        this.updateData()
    }

    render() {
        let total = this.state.allPositiveSentiments + this.state.allNegativeSentiments + this.state.allNeutralSentiments
        let netPositiveTweets = (this.state.allPositiveSentiments - this.state.allNegativeSentiments).toFixed(2)
        let postiveTweetPercentage = ((this.state.allPositiveSentiments / (total)) * 100).toFixed(2)
        let netNegativeTweetPercentage = ((this.state.allNegativeSentiments / (total)) * 100).toFixed(2)
        let negativeTweetPercentage = this.state.allNegativeSentiments
        let aurinDataObese = this.state.aurinDataObese;
        let aurinDataPhyInac = this.state.aurinDataPhyInac;
        let aurinDataSmokers = this.state.aurinDataSmokers;
        let aurinDataOverWeight = this.state.aurinDataOverWeight;
        let negativeTweets = ((this.state.allNegativeSentiments / total) * 100).toFixed(2)
        let netPositiveTweetsPercentage = postiveTweetPercentage * 100


        return (

            <Paper style={{ marginLeft: 10, height: '400', width: '100%', display: this.state.displayData, padding: 8 }}>
                <div>
                    <p style={{ fontWeight: 700, fontSize: 18 }}> Name of the City : {this.props.city}</p>
                    <p style={{ fontWeight: 700 }}>Positive Tweets: <span style={{
                        color: postiveTweetPercentage > 0 && postiveTweetPercentage < 25 ? 'red' : postiveTweetPercentage >= 25 && postiveTweetPercentage < 55 ? 'orange' :
                            postiveTweetPercentage >= 55 && postiveTweetPercentage < 100 ? 'green' : 'black'
                    }}>{isNaN(postiveTweetPercentage) ? 0.0 : postiveTweetPercentage} %</span></p>

                    <p style={{ fontWeight: 700 }}>Negative Tweets: &nbsp;
                    <span style={{
                            color: negativeTweets > 0 && negativeTweets < 25 ? 'red' : negativeTweets >= 25 && negativeTweets < 55 ? 'orange' :
                                negativeTweets >= 55 && negativeTweets < 100 ? 'green' : 'black'
                        }}>
                            {isNaN(negativeTweets) ? 0.0 : negativeTweets} %
                    </span>
                    </p>

                    <p style={{ fontWeight: 700 }}>Net Positive Tweets (#): &nbsp;
                        <span style={{
                            color: netPositiveTweets > 0.0 && netPositiveTweets < 0.25 ? 'red' : netPositiveTweets >= 0.25 && netPositiveTweets < 0.55 ? 'orange' :
                                netPositiveTweets >= 0.55 ? 'green' : 'black'
                        }}>
                            {netPositiveTweets}</span> <p></p>( Positive Tweets:&nbsp;
                    <span style={{
                            color: this.state.allPositiveSentiments > 0 && this.state.allPositiveSentiments < 500 ? 'red' : this.state.allPositiveSentiments >= 500 && this.state.allPositiveSentiments < 1200 ? 'orange' :
                                this.state.allPositiveSentiments >= 1200 ? 'green' : 'black'
                        }} >
                            {isNaN(this.state.allPositiveSentiments) ? 0 : this.state.allPositiveSentiments}
                        </span>&nbsp;, Negative Tweets:
                    <span style={{
                            color: negativeTweetPercentage > 0 && negativeTweetPercentage < 500 ? 'red' : negativeTweetPercentage >= 500 && negativeTweetPercentage < 1200 ? 'orange' :
                                negativeTweetPercentage >= 1200 ? 'green' : 'black'
                        }}>
                            {negativeTweetPercentage}
                        </span> , Total tweets: &nbsp;
                            {total} )</p>
                    <p style={{ fontWeight: 700 }}>Population not overweight: {aurinDataOverWeight} %</p>
                    <p style={{ fontWeight: 700 }}>Population not obese: {aurinDataObese} % </p>
                    <p style={{ fontWeight: 700 }}>Population that is physically active: {aurinDataPhyInac}%</p>
                    <p style={{ fontWeight: 700 }}> Population that do not smoke: {aurinDataSmokers}%</p>
                    
                </div>
            </Paper>
        )
    }
}
