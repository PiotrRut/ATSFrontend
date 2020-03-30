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


const styles = theme => ({
  root: {
    minWidth: 200,
    maxWidth: 300,
    flexGrow: 1,
    margin: 20
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
      checked: false,
      setChecked: false
     }
  }

  // Fetch a list of all customer when the component mounts and save into local array
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
        <Button color="blue" onClick={this.handleOpen}>
          Register a new customer
        </Button>
        <Button size="small" onClick={this.handleOpenUpdate}>Update an existing customer</Button>
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
              First choose the employee you would like to edit, and update their details.
              <br/>
              Remember to always specify the role, even if it is not changing.
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
      </div>
    )
  }
}

MaintainCustomers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (MaintainCustomers);
