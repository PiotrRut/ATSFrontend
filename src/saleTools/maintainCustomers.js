import React from 'react'
import '../App.scss'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Grid from "@material-ui/core/Grid"
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Grow from '@material-ui/core/Grow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';

import EditRoundedIcon from '@material-ui/icons/EditRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import PaymentRoundedIcon from '@material-ui/icons/PaymentRounded';


const styles = theme => ({
  root: {
    minWidth: 200,
    maxWidth: 300,
    flexGrow: 1,
    margin: 20,
  },
  title: {
    fontSize: 17,
  },
  pos: {
    marginBottom: 12,
  },
});


class MaintainCustomers extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allCustomers: [],
      open: false,
      openUpdate: false,
      openCard: false,
      newCustomer: {
        name: '',
        surname: '',
        alias: '',
        email: '',
        phoneNo: ''
      },
      editedCustomer: {
        name: null,
        surname: null,
        alias: null,
        email: null,
        phoneNo: null,
        _id: null
      },
      newCard: {
          owner: null,
          nameOnCard: '',
          cardNumber: '',
          cardIssuer: '',
          cvc: '',
          exp: ''
      },
      checked: false,
      setChecked: false
     }
  }

  // Fetch a list of all customer and their cards when the component mounts and save into local array
  componentDidMount() {
    axios.get(`${APIURL}/customers/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allCustomers: res.data }, console.log(res)))
    console.log(this.state.allCustomers)
  }

  // Post the entered customer's details to backend to register
  registerSubmit = () => {
    axios.post(`${APIURL}/customers/newCustomer?secret_token=${this.props.token}`, {
      name: this.state.newCustomer.name,
      surname: this.state.newCustomer.surname,
      alias: this.state.newCustomer.alias,
      email: this.state.newCustomer.email,
      phoneNo: this.state.newCustomer.phoneNo
    })
      .then(response => {
        console.log(response)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  };

  // Delete a customer and update the list
  deleteCustomer = (_id) => {
    axios.delete(`${APIURL}/customers/deleteCustomer?secret_token=${this.props.token}`, {
        data: { '_id': _id }
    })
      .then(response => {
        console.log(response)
        window.location.reload()
        console.log(_id)
      })
      .catch(error => {
        console.log(error)
        console.log(_id)
      });
  };

  // Update customer details and return to backend
  updateCustomer = () => {
    axios.patch(`${APIURL}/customers/updateCustomer?secret_token=${this.props.token}`, {
      'name': this.state.editedCustomer.name,
      'surname': this.state.editedCustomer.surname,
      'alias': this.state.editedCustomer.alias,
      'email': this.state.editedCustomer.email,
      'phoneNo': this.state.editedCustomer.phoneNo,
      '_id': this.state.editedCustomer._id
    })
      .then(response => {
        console.log(response)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  }

  addNewCard = () => {
    axios.post(`${APIURL}/customers/addPayment?secret_token=${this.props.token}`, {
     owner: this.state.newCard.owner,
     nameOnCard: this.state.newCard.nameOnCard,
     cardNumber: this.state.newCard.cardNumber,
     cardIssuer: this.state.newCard.cardIssuer,
     cvc: this.state.newCard.cvc,
     exp: this.state.newCard.exp
    })
      .then(response => {
        console.log(response)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  }

  // Updating customer details for new customers
  handleInput = event => {
    this.state.newCustomer[event.target.name] = event.target.value
    this.setState({ newCustomer: this.state.newCustomer});
  };

   // Updating customer details for editing customers
  handleChangeInput = event => {
    this.state.editedCustomer[event.target.name] = event.target.value
    this.setState({ editedCustomer: this.state.editedCustomer});
  };

   // Updating customer details for assigning new cards
  handleCardInput = event => {
    this.state.newCard[event.target.name] = event.target.value
    this.setState({ newCard: this.state.newCard});
  };

  // Dialog open and close
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  // Dialog open and close for updating customers
  handleOpenUpdate = () => {
    this.setState({ openUpdate: true });
  };
  handleCloseUpdate = () => {
    this.setState({ openUpdate: false });
  };

// Dialog open and close for adding new cards
  handleOpenCard = () => {
    this.setState({ openCard: true });
  };
  handleCloseCard = () => {
    this.setState({ openCard: false });
  };

  // Handler for the check button
  handleCheckButton = () => {
    { !this.state.checked ?
      this.setState({checked: true})
      : this.setState({checked: false})
    }
  };

  render () {
    const { classes } = this.props;
    return (
      <div>
        <h1>Customers</h1>
        <h3>Number of registered customers: {this.state.allCustomers.length}</h3>
        <Button size="small" onClick={this.handleOpen} startIcon={<PersonAddRoundedIcon/>}>
          Register a new customer
        </Button>
        <Button size="small" onClick={this.handleOpenUpdate} startIcon={<EditRoundedIcon/>}>
        Update an existing customer
        </Button>
        <Button size="small" onClick={this.handleOpenCard} startIcon={<PaymentRoundedIcon/>}>
          Register new payment card
        </Button>
        <br/> <br/>

        {/* Card views for registered customers */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={1}>
              {
                this.state.allCustomers.map(customer => (
                  <div>
                  <Card className={classes.root} variant="outlined" >
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {customer.name} {customer.surname}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Alias: {customer.alias}
                      </Typography>
                     { customer.customerStatus &&
                     <Typography variant="body2" component="p">
                        Status: {customer.customerStatus} customer
                      </Typography>
                      }
                      <Typography variant="body2" component="p">
                        Number of payment cards: {customer.cards.length}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'center' }}>
                        <Button
                         startIcon={<HighlightOffRoundedIcon/>}
                         variant="outlined"
                         color="secondary"
                         size="small"
                         onClick={() => {this.deleteCustomer(customer._id)}}>Delete Customer
                        </Button>
                    </CardActions>
                  </Card>
                </div>
                ))
              }
            </Grid>
          </Grid>
        </Grid>

        {/* Dialog for registering new customers */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Register a new employee</DialogTitle>
          <DialogContent>
            <TextField
              required
              variant="standard"
              value={this.state.newCustomer.name}
              onChange={this.handleInput}
              name="name"
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
            />
            <TextField
              required
              variant="standard"
              value={this.state.newCustomer.surname}
              onChange={this.handleInput}
              name="surname"
              margin="dense"
              id="surname"
              label="Surname"
              fullWidth
            />
            <TextField
              required
              variant="standard"
              value={this.state.newCustomer.alias}
              onChange={this.handleInput}
              name="alias"
              margin="dense"
              id="alias"
              label="Alias"
              fullWidth
            />
            <TextField
              required
              variant="standard"
              value={this.state.newCustomer.email}
              onChange={this.handleInput}
              name="email"
              margin="dense"
              id="email"
              label="E-mail"
              fullWidth
            />
            <TextField
              required
              variant="standard"
              value={this.state.newCustomer.phoneNo}
              onChange={this.handleInput}
              name="phoneNo"
              margin="dense"
              id="phoneNo"
              label="Phone number"
              fullWidth
            />
          <DialogActions>
            <Button onClick={this.registerSubmit}>Register</Button>
          </DialogActions>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing existing customers' details */}
        <Dialog
          open={this.state.openUpdate}
          onClose={this.handleCloseUpdate}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update customer details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              First choose the customer you would like to edit, and update their details.
              <br/>
            </DialogContentText>
            <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="_id">Customer to edit</InputLabel>
              <Select
                autoFocus
                name='_id'
                value={this.state.editedCustomer._id}
                onChange={this.handleChangeInput}
                variant='standard'
                margin="dense"
                id="_id"
                label="Customer to edit"
                fullWidth
              >
                { this.state.allCustomers.map(customer => (
                  <MenuItem value={customer._id}>{customer.name} {customer.surname}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <TextField
              variant="standard"
              value={this.state.editedCustomer.name}
              onChange={this.handleChangeInput}
              name="name"
              margin="dense"
              id="name"
              label="Name"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.editedCustomer.surname}
              onChange={this.handleChangeInput}
              name="surname"
              margin="dense"
              id="surname"
              label="Surname"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.editedCustomer.alias}
              onChange={this.handleChangeInput}
              name="alias"
              margin="dense"
              id="alias"
              label="Alias"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.editedCustomer.email}
              onChange={this.handleChangeInput}
              name="email"
              margin="dense"
              id="email"
              label="E-mail"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.editedCustomer.phoneNo}
              onChange={this.handleChangeInput}
              name="phoneNo"
              margin="dense"
              id="phoneNo"
              label="Phone number"
              fullWidth
            />
            <DialogActions>
              <Button onClick={this.updateCustomer}>Update Customer</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

        {/* Dialog for assigning new cards to customers */}
        <Dialog
          open={this.state.openCard}
          onClose={this.handleCloseCard}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Assign new payment card to customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              First choose the customer to assignt the card to, next add card details.
              <br/>
            </DialogContentText>
            <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="owner">Customer to assign new card</InputLabel>
              <Select
                required
                autoFocus
                name='owner'
                value={this.state.newCard.owner}
                onChange={this.handleCardInput}
                variant='standard'
                margin="dense"
                id="owner"
                label="Customer to assign new card"
                fullWidth
              >
                { this.state.allCustomers.map(customer => (
                  <MenuItem value={customer._id}>{customer.name} {customer.surname}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <TextField
              required
              variant="standard"
              value={this.state.newCard.nameOnCard}
              onChange={this.handleCardInput}
              name="nameOnCard"
              margin="dense"
              id="nameOnCard"
              label="Name on card"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.newCard.cardNumber}
              onChange={this.handleCardInput}
              name="cardNumber"
              margin="dense"
              id="cardNumber"
              label="Card Number"
              fullWidth
              required
            />
            <TextField
              variant="standard"
              value={this.state.newCard.cardIssuer}
              onChange={this.handleCardInput}
              name="cardIssuer"
              margin="dense"
              id="cardIssuer"
              label="Card Issuer"
              fullWidth
              required
            />
            <TextField
              variant="standard"
              value={this.state.newCard.cvc}
              onChange={this.handleCardInput}
              name="cvc"
              margin="dense"
              id="cvc"
              label="CVC Code"
              fullWidth
              required
            />
            <TextField
              variant="standard"
              value={this.state.newCard.exp}
              onChange={this.handleCardInput}
              name="exp"
              margin="dense"
              id="exp"
              label="Expiry date (MMYY format)"
              fullWidth
            />
            <DialogActions>
              <Button onClick={this.addNewCard}>Register Card</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

MaintainCustomers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (MaintainCustomers);
