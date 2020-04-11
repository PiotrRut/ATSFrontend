import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';

class Sale extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allCustomers: [ ],
      blanks: [ ],
      newSale: {
        blank: '',
        seller: '',
        customer: '',
        from: '',
        to: '',
        GBP_Price: '',
        USD_Price: '',
        localTax: '',
        otherTaxes: '',
        commission: '',
        latePayment: '',
        paymentType: '',
        cardNumber: '',
        exchangeRate: '',
        sold_date: new Date(),
        totalAmount: '',
      },
    }
  }

  // Get the customers list on component mount and set state
  componentDidMount() {
    axios.get(`${APIURL}/customers/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allCustomers: res.data }, console.log(res)))
    console.log(this.state.allCustomers)

    // Get all blanks assigned to the currently logged in advisor
    axios.post(`${APIURL}/blanks/blanksByAdvisor?secret_token=${this.props.token}`, {
      'myID': this.props.mongoID
    })
      .then(res => this.setState({ blanks: res.data }))

  }

  // Post the updated changes to the database
  makeSale = () => {
      axios.post(`${APIURL}/sales/newSale?secret_token=${this.props.token}`, {
        saleType: this.state.newSale.saleType,
        blank: this.state.newSale.blank,
        seller: this.state.newSale.seller,
        customer: this.state.newSale.customer,
        from: this.state.newSale.from,
        to: this.state.newSale.to,
        GBP_Price: this.state.newSale.GBP_Price,
        USD_Price: this.state.newSale.USD_Price,
        localTax: this.state.newSale.localTax,
        otherTaxes: this.state.newSale.otherTaxes,
        commission: this.state.newSale.commission,
        latePayment: this.state.newSale.latePayment,
        paymentType: this.state.newSale.paymentType,
        cardNumber: this.state.newSale.cardNumber,
        exchangeRate: this.state.newSale.exchangeRate,
        sold_date: this.state.newSale.sold_date,
        totalAmount: this.state.newSale.totalAmount
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
    <h1>Create a new sale</h1>
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

export default Sale
