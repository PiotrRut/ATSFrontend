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
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import Grow from '@material-ui/core/Grow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteSweepRoundedIcon from '@material-ui/icons/DeleteSweepRounded';

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
        _id: null
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

  // Update customer details and return to backend
  updateCustomer = () => {
    axios.patch(`${APIURL}/customers/updateCustomer?secret_token=${this.props.token}`, {
      'customerStatus': this.state.editedCustomer.status,
      'discount': this.state.editedCustomer.discount,
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
                      { customer.discount ? 
                      <Typography variant="body2" component="p">
                        Discount: {customer.discount}
                      </Typography> :
                      <Typography color="textSecondary" variant="body2" component="p">
                        No discount applied
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
            <TextField
              variant="standard"
              value={this.state.editedCustomer.status}
              onChange={this.handleChangeInput}
              name="status"
              margin="dense"
              id="status"
              label="Customer's status"
              fullWidth
            />
            <TextField
              variant="standard"
              value={this.state.editedCustomer.discount}
              onChange={this.handleChangeInput}
              name="discount"
              margin="dense"
              id="discount"
              label="Discount type"
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
