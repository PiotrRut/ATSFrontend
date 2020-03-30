import React from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import APIURL from '../misc/backend.js'
import '../App.scss'
import moment from 'moment'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';

class ExchangeRate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      exchangeRate: { },
      updatedRate: ''
    }
  } 

  componentDidMount() {
    axios.get(`${APIURL}/sales/getExchangeRate?secret_token=${this.props.token}`)
    .then(res => this.setState({ exchangeRate: res.data }, console.log(res)))
  }

  updateExchangeRate = () => {
      axios.post(`${APIURL}/sales/updateExchangeRate?secret_token=${this.props.token}`, {
          _id: this.state.exchangeRate._id,
          rate: this.state.updatedRate
      }).then(res => {
        window.location.reload()
      })
  }

  handleInput = (e) => {
    this.setState({ updatedRate: e.target.value })
  }

  render () {
    return (
    <div>
    <h1>The current exchange rate is:</h1>
    <h1>$1 USD * {this.state.exchangeRate.rate} = £1 ({this.state.exchangeRate.localCurrencyCode})</h1>
    <h5>Last Update: {moment(this.state.exchangeRate.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</h5>
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
        <Grid item xs={3}>
            <TextField id="standard-basic" label="New Exchange Rate" value={this.state.updatedRate} onChange={this.handleInput}/>
            <br/> <br/> 
            <Button onClick={this.updateExchangeRate} startIcon={<AttachMoneyRoundedIcon/>}>Update Exchange Rate</Button>
        </Grid>
    </Grid>
    </div>
    )
  }
}

export default ExchangeRate

