import React from 'react';
import Grid from '@material-ui/core/Grid';
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick';
import Chart from 'chart.js'
import aurinData from '../../Assets/data files/Output.json'

ReactChartkick.addAdapter(Chart)

class AnalysisContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayData: props.isMarkerClicked,
            allNegativeSentiments: 0,
            allPositiveSentiments: 0,
            allNeutralSentiments: 0
            , aurinCity: '',
            aurinDataObese: 0.0,
            aurinDataOverWeight: 0.0,
            aurinDataPhyInac: 0.0,
            aurinDataSmokers: 0.0
        }
    }

    getAurinData = () => {
        let selectedCity = this.props.selectedMarker.city
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
    updateGraph = () => {
        let allNeutralSentimentsConter = 0;
        let allNegativeSentimentsCounter = 0;
        let allPositiveSentimentsCounter = 0;
        this.props.selectedMarker.data.map((data, index) => {
            if (this.props.selectedMarker.city === data.city && data.sentiment === "0") {
                allNeutralSentimentsConter += data.sentimentValue
                this.setState({
                    allNeutralSentiments: allNeutralSentimentsConter
                })
            }
            else if (this.props.selectedMarker.city === data.city && data.sentiment === "-1") {
                allNegativeSentimentsCounter += data.sentimentValue;
                this.setState({
                    allNegativeSentiments: allNegativeSentimentsCounter
                })
            }
            else if (this.props.selectedMarker.city === data.city && data.sentiment === "1") {
                allPositiveSentimentsCounter += data.sentimentValue;
                this.setState({
                    allPositiveSentiments: allPositiveSentimentsCounter
                })
            }
        })
    }

    componentWillReceiveProps(nextProp, nextState) {
        this.updateGraph()
        this.getAurinData()
    }

    componentDidMount() {
        this.updateGraph()
        this.getAurinData()
    }
    render() {
        let total = this.state.allPositiveSentiments + this.state.allNegativeSentiments + this.state.allNeutralSentiments
        let netPositiveTweets = (this.state.allPositiveSentiments - this.state.allNegativeSentiments).toFixed(2)
        let postiveTweetPercentage = ((this.state.allPositiveSentiments / (total))).toFixed(2)
        let netNegativeTweetPercentage = ((this.state.allNegativeSentiments / (total))).toFixed(2)
        let negativeTweetPercentage = this.state.allNegativeSentiments
        let neutralTweets = (this.state.allNeutralSentiments / total).toFixed(2)
        let aurinDataObese = this.state.aurinDataObese;
        let aurinDataPhyInac = this.state.aurinDataPhyInac;
        let aurinDataSmokers = this.state.aurinDataSmokers;
        let aurinDataOverWeight = this.state.aurinDataOverWeight;
        let negativeTweets = ((this.state.allNegativeSentiments / total) * 100).toFixed(2)
        let netPositiveTweetsPercentage = postiveTweetPercentage * 100
        return (
            <div >
                <Grid container spacing={24} justify="center">
                    <Grid item xs={6}>
                        <span style={{ display: this.state.displayData }}>
                            <ColumnChart colors={["#b00"]} stacked={true} data={[["Positive Tweets", netPositiveTweetsPercentage], ["Obese", aurinDataObese], ["PhyInac", aurinDataPhyInac], ["Smokers", aurinDataSmokers], ["OverWeight", aurinDataOverWeight]]} xtitle="Data in %" ytitle="Population"/>
                        </span>
                    </Grid>
                    <Grid item xs={6}>
                        <span style={{ display: 'block' }} style={{ height: 100, width: '75%' }}>
                            <PieChart donut={true} data={[["Negative Sentiments", netNegativeTweetPercentage],
                            ["Neutral Sentiments", neutralTweets], ["Positive Sentiments", postiveTweetPercentage]]} legend={true}/>
                        </span>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

export default AnalysisContainer;