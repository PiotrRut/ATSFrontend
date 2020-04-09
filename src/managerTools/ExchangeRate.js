import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';

class ExchangeRate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      exchangeRate: { },
      updatedRate: '',
      helperText: '',
      error: false
    }
  }

  // Get the exchange rate on component mount and set state
  componentDidMount() {
    axios.get(`${APIURL}/sales/getExchangeRate?secret_token=${this.props.token}`)
    .then(res => this.setState({ exchangeRate: res.data }, console.log(res)))
  }

  // Post the updated changes to the database
  updateExchangeRate = () => {
      axios.patch(`${APIURL}/sales/updateExchangeRate?secret_token=${this.props.token}`, {
          '_id': this.state.exchangeRate._id,
          'rate': this.state.updatedRate
      }).then(res => {
        window.location.reload()
      })
  }

  // Updating state and validating input from the text field
  handleInput = (e) => {
    this.setState({ updatedRate: e.target.value })
    if (e.target.value.match(/^[0-9]{5}\.[0-9]{4}$/)) {
      this.setState({ helperText: '', error: false })
    } else {
      this.setState({ helperText: 'Format must match XXXXX.YYYY', error: true })
    }
  }

  render () {
    return (
    <div>
    <h1>The current local currency exchange rate is:</h1>
    <h1>$1 (USD) * {this.state.exchangeRate.rate} = £1 ({this.state.exchangeRate.localCurrencyCode})</h1>
    <h5>Last Update: {moment(this.state.exchangeRate.updatedAt).format('Do MMMM YYYY, h:mm:ss a')}</h5>
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
        <Grid item xs={3}>
            <TextField
             id="standard-basic"
             label="New Exchange Rate"
             value={this.state.updatedRate}
             onChange={this.handleInput}
             error={this.state.error}
             helperText={this.state.helperText}
             style={{width: '220px'}}
             />
            <br/> <br/>
            <Button
             disabled={this.state.error || !this.state.updatedRate}
             onClick={this.updateExchangeRate}
             startIcon={<AttachMoneyRoundedIcon/>}>
               Update Exchange Rate
            </Button>
        </Grid>
    </Grid>
    </div>
    )
  }
}

export default ExchangeRate
