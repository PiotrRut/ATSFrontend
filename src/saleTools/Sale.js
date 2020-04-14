import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListSubheader from '@material-ui/core/ListSubheader';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class Sale extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allCustomers: [ ],
      blanks: [ ],
      commissionRates: [ ],
      newSale: {
        blank: '',
        seller: this.props.mongoID,
        customer: '',
        from: '',
        to: '',
        GBP_Price: null,
        USD_Price: null,
        localTax: '',
        otherTaxes: null,
        commission: '',
        latePayment: 'false',
        paymentType: '',
        cardNumber: '',
        issuer: '',
        sold_date: new Date(),
        totalAmount: '',
      },
      exchangeRate: { },
      checked: false
    }
  }

  // Get the customers list on component mount and set state
  componentDidMount() {
    axios.get(`${APIURL}/customers/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allCustomers: res.data }, console.log(res)))
    console.log(this.state.allCustomers)

    // Get all commission rates
    axios.get(`${APIURL}/commissions/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ commissionRates: res.data }, console.log(res)))
    console.log(this.state.allCustomers)

    // Get all blanks assigned to the currently logged in advisor
    axios.post(`${APIURL}/blanks/blanksByAdvisor?secret_token=${this.props.token}`, {
      'myID': this.props.mongoID
    })
      .then(res => this.setState({ blanks: res.data }))

    // Get the current exchange rate
    axios.get(`${APIURL}/sales/getExchangeRate?secret_token=${this.props.token}`)
    .then(res => this.setState({ exchangeRate: res.data }, console.log(res)))
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
        issuer: this.state.newSale.issuer,
        exchangeRate: this.state.exchangeRate.rate,
        sold_date: this.state.newSale.sold_date,
        totalAmount: this.state.newSale.totalAmount
      }).then(res => {
        console.log(res)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  }

  // Updating sale details from text fields and update state
  handleInput = event => {
    this.state.newSale[event.target.name] = event.target.value
    this.setState({ newSale: this.state.newSale});
  };

   // Handling the input from the date picker
   handleDateInput = (date) => {
    this.state.newSale.sold_date = date
    this.setState({ newSale: this.state.newSale })
  }

  render () {
    return (
    <div>
    <h1>Register a new sale</h1>

    <Grid container spacing={0} direction="row" alignItems="center" justify="center" >
      <Grid item xs={3}>
        <FormControl required style={{width: "200px"}}>
          <InputLabel htmlFor="saleType">Type of sale</InputLabel>
            <Select
              name='saleType'
              value={this.state.newSale.saleType}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="saleType"
              label="saleType"
              fullWidth
              style={{textAlign: 'left'}}
          >
              <MenuItem value='Domestic'>Domestic</MenuItem>
              <MenuItem value='Interline'>Interline</MenuItem>
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
      <FormControl required style={{width: "200px"}}>
          <InputLabel htmlFor="saleType">Payment method</InputLabel>
            <Select
              name='paymentType'
              value={this.state.newSale.paymentType}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="paymentType"
              label="Payment method"
              fullWidth
              style={{textAlign: 'left'}}
          >
              <MenuItem value='Cash'>Cash</MenuItem>
              <MenuItem value='Card'>Card</MenuItem>
            </Select>
        </FormControl>
      </Grid>
    </Grid>
    <br/>
    <Grid container spacing={4} direction="row" alignItems="center" justify="center" >
      <Grid item xs={2}>
        <FormControl required style={{width: "200px"}}>
          <InputLabel htmlFor="blank">Blank</InputLabel>
            <Select
              name='blank'
              value={this.state.newSale.blank}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="blank"
              label="blank"
              fullWidth
              style={{textAlign: 'left'}}
          >
            {this.state.blanks.filter(blank => (
              (blank.sold !== true) && (blank.void !== true)
            )).map(blank => (
              <MenuItem value={blank._id}>{blank.type}{blank.number}</MenuItem>
            ))}
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <FormControl required style={{width: "200px"}}>
          <InputLabel htmlFor="customer">Customer</InputLabel>
            <Select
              name='customer'
              value={this.state.newSale.customer}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="customer"
              label="customer"
              fullWidth
              style={{textAlign: 'left'}}
          >
             <ListSubheader>Registered Customers</ListSubheader>
            { this.state.allCustomers.map(customer => (
              <MenuItem value={customer._id}>{customer.name} {customer.surname} - {customer.customerStatus}</MenuItem>
            ))}
            <ListSubheader>Other</ListSubheader>
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
      <TextField
        required
        variant="standard"
        value={this.state.newSale.from}
        onChange={this.handleInput}
        name="from"
        margin="dense"
        id="from"
        label="From - Airport"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        required
        variant="standard"
        value={this.state.newSale.to}
        onChange={this.handleInput}
        name="to"
        margin="dense"
        id="to"
        label="To - Airport"
        fullWidth
      />
      </Grid>
    </Grid>
    <br/>

    <Grid container spacing={4} direction="row" alignItems="center" justify="center" >
      <Grid item xs={2}>
      <TextField
        variant="standard"
        value={this.state.newSale.GBP_Price}
        onChange={this.handleInput}
        name="GBP_Price"
        margin="dense"
        id="GBP_Price"
        label="GBP total (if applicable)"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        variant="standard"
        value={this.state.newSale.USD_Price}
        onChange={this.handleInput}
        name="USD_Price"
        margin="dense"
        id="USD_Price"
        label="USD total (if applicable)"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        required
        variant="standard"
        value={this.state.newSale.localTax}
        onChange={this.handleInput}
        name="localTax"
        margin="dense"
        id="localTax"
        label="Local tax"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        disabled={this.state.newSale.saleType === 'Domestic'}
        variant="standard"
        value={this.state.newSale.otherTaxes}
        onChange={this.handleInput}
        name="otherTaxes"
        margin="dense"
        id="otherTaxes"
        label="Other taxes (if applicable)"
        fullWidth
      />
      </Grid>
    </Grid>

    <Grid container spacing={4} direction="row" alignItems="center" justify="center">
      <Grid item xs={2}>
      <FormControl required style={{width: "200px"}}>
          <InputLabel htmlFor="commission">Commission Rate</InputLabel>
            <Select
              name='commission'
              value={this.state.newSale.commission}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="commission"
              label="commission"
              fullWidth
              style={{textAlign: 'left'}}
          >
            { this.state.commissionRates.map(rate => (
              <MenuItem value={rate.rate}>{rate.type} - {rate.rate}%</MenuItem>
            ))}
            </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
      <TextField
        disabled={this.state.newSale.paymentType === 'Cash'}
        variant="standard"
        value={this.state.newSale.cardNumber}
        onChange={this.handleInput}
        name="cardNumber"
        margin="dense"
        id="cardNumber"
        label="Card Number"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <TextField
        disabled={this.state.newSale.paymentType === 'Cash'}
        variant="standard"
        value={this.state.newSale.issuer}
        onChange={this.handleInput}
        name="issuer"
        margin="dense"
        id="issuer"
        label="Card Issuer"
        fullWidth
      />
      </Grid>
      <Grid item xs={2}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          name="sold_date"
          id="date-picker-dialog"
          label="Date of sale"
          format="yyyy-MM-dd"
          onChange={this.handleDateInput}
          value={this.state.newSale.sold_date}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>

    <Grid container spacing={4} direction="row" alignItems="center" justify="center">
      <Grid item xs={2}>
        <Button onClick={this.makeSale} variant='small'>
          Register Sale
        </Button>
      </Grid>
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checked}
              onChange={() => {
                if (this.state.checked) {
                  this.state.newSale.latePayment = 'false'
                } else {
                  this.state.newSale.latePayment = 'true'
                }
                this.setState({ newSale: this.state.newSale})
                this.setState({ checked: true})
              }}
              color='primary'
            />
          }
          label="Pay Later"
          style={{color: 'black'}}
        />
      </Grid>
    </Grid>

    </div>
    )
  }
}

export default Sale
