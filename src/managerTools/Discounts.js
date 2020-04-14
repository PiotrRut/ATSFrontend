import React from 'react'
import '../App.scss'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Grid from "@material-ui/core/Grid"
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
import CardContent from '@material-ui/core/CardContent';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

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


class Discounts extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allCustomers: [],
      open: false,
      openUpdate: false,
      editedCustomer: {
        status: null,
        discount: null,
        fixedDiscount: null,
        flexibleU1000: null,
        flexibleO1000: null,
        flexibleO2000: null,
        _id: null
      }
     }
  }


  // Fetch a list of all customer and their cards when the component mounts and save into local array
  componentDidMount() {
    axios.get(`${APIURL}/customers/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allCustomers: res.data }, console.log(res)))
    console.log(this.state.allCustomers)
  }

  // Update customer details and return to backend
  updateCustomer = () => {
    axios.patch(`${APIURL}/customers/updateCustomer?secret_token=${this.props.token}`, {
      'customerStatus': this.state.editedCustomer.status,
      'discount': this.state.editedCustomer.discount,
      '_id': this.state.editedCustomer._id,
      'fixedDiscount': this.state.editedCustomer.fixedDiscount,
      'flexibleU1000': this.state.editedCustomer.flexibleU1000,
      'flexibleO1000': this.state.editedCustomer.flexibleO1000,
      'flexibleO2000': this.state.editedCustomer.flexibleO2000,
    })
      .then(response => {
        console.log(response)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  }


   // Updating customer details for editing customers
  handleChangeInput = event => {
    this.state.editedCustomer[event.target.name] = event.target.value
    this.setState({ editedCustomer: this.state.editedCustomer});
  };

  // Dialog open and close for updating customers
  handleOpenUpdate = () => {
    this.setState({ openUpdate: true });
  };
  handleCloseUpdate = () => {
    this.setState({ openUpdate: false });
  };

  render () {
    const { classes } = this.props;
    return (
      <div>
        <h1>Customer Discounts</h1>
        <h3>Number of registered customers: {this.state.allCustomers.length}</h3>
        <Button size="small" onClick={this.handleOpenUpdate} startIcon={<EditRoundedIcon/>}>
          Assign discounts and status
        </Button>
        <br/> <br/>

        {/* Card views for registered customers */}
        <Grid container spacing={1}>
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
                      { customer.customerStatus ? 
                      <Typography variant="body2" component="p">
                        Status: {customer.customerStatus}
                      </Typography> :
                      <Typography color="textSecondary" variant="body2" component="p">
                        No status defined
                      </Typography>
                      }
                      { customer.fixedDiscount && 
                      <Typography variant="body2" component="p">
                        Discount: {customer.discount} {customer.fixedDiscount}%
                      </Typography> 
                      }
                      { !customer.discount && 
                      <Typography variant="body2" component="p" color="textSecondary">
                        No discount assigned
                      </Typography>
                      }
                      { customer.flexibleU1000 &&
                      <Typography variant="body2" component="p" color="textSecondary">
                        Flexible: Under £1000: {customer.flexibleU1000}%
                      </Typography>
                      }
                      { customer.flexibleO1000 &&
                      <Typography variant="body2" component="p">
                        Flexible: £1000-2000: {customer.flexibleO1000}%
                      </Typography>
                      }
                       { customer.flexibleO2000 &&
                      <Typography variant="body2" component="p">
                        Flexible: Over £2000: {customer.flexibleO2000}%
                      </Typography>
                      }
                      <Typography variant="body2" component="p">
                        Number of payment cards: {customer.cards.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
                ))
              }
            </Grid>
          </Grid>
        </Grid>

        {/* Dialog for setting existing customers' status */}
        <Dialog
          open={this.state.openUpdate}
          onClose={this.handleCloseUpdate}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Set customer status and discount</DialogTitle>
          <DialogContent>
            <DialogContentText>
              First choose the customer you would like to edit, then set their status and discount.
              Note that discounts can only be applied to valued customers.
              <br/>
            </DialogContentText>
            <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="_id">Choose a customer</InputLabel>
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
            <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                name='status'
                value={this.state.editedCustomer.status}
                onChange={this.handleChangeInput}
                variant='standard'
                margin="dense"
                id="status"
                label="Status"
                fullWidth
              >
                  <MenuItem value='Regular'>Regular</MenuItem>
                  <MenuItem value='Valued'>Valued</MenuItem>
              </Select>
            </FormControl>
            <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="discount">Discount type</InputLabel>
              <Select
                name='discount'
                disabled={this.state.editedCustomer.status === 'Regular' || !this.state.editedCustomer.status}
                value={this.state.editedCustomer.discount}
                onChange={this.handleChangeInput}
                variant='standard'
                margin="dense"
                id="discount"
                label="Discount type"
                fullWidth
              >
                  <MenuItem value='Flexible'>Flexible</MenuItem>
                  <MenuItem value='Fixed'>Fixed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="standard"
              disabled={this.state.editedCustomer.status === 'Regular' || !this.state.editedCustomer.status || this.state.editedCustomer.discount === 'Flexible'}
              value={this.state.editedCustomer.fixedDiscount}
              onChange={this.handleChangeInput}
              name="fixedDiscount"
              margin="dense"
              id="fixedDiscount"
              label="Fixed discount % (if applicable)"
              fullWidth
            />
            <TextField
              variant="standard"
              disabled={this.state.editedCustomer.status === 'Regular' || !this.state.editedCustomer.status || this.state.editedCustomer.discount === 'Fixed'}
              value={this.state.editedCustomer.flexibleU1000}
              onChange={this.handleChangeInput}
              name="flexibleU1000"
              margin="dense"
              id="flexibleU1000"
              label="Flexible < £1000 (if applicable)"
              fullWidth
            />
            <TextField
              variant="standard"
              disabled={this.state.editedCustomer.status === 'Regular' || !this.state.editedCustomer.status || this.state.editedCustomer.discount === 'Fixed'}
              value={this.state.editedCustomer.flexibleO1000}
              onChange={this.handleChangeInput}
              name="flexibleO1000"
              margin="dense"
              id="flexibleO1000"
              label="Flexible >= £1000 & < £2000 (if applicable)"
              fullWidth
            />
            <TextField
              variant="standard"
              disabled={this.state.editedCustomer.status === 'Regular' || !this.state.editedCustomer.status || this.state.editedCustomer.discount === 'Fixed'}
              value={this.state.editedCustomer.flexibleO2000}
              onChange={this.handleChangeInput}
              name="flexibleO2000"
              margin="dense"
              id="flexibleO2000"
              label="Flexible > £2000 (if applicable)"
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

Discounts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (Discounts);
