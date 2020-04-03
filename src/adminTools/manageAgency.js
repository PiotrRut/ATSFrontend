import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import AttachMoneyRoundedIcon from '@material-ui/icons/AttachMoneyRounded';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel"


class ManageAgency extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      agencyDetails: { },
      updatedDetails: {
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: ''
      },
      helperText: '',
      error: false,
      open: false
    }
  }

  // Get the exchange rate on component mount and set state
  componentDidMount() {
    axios.get(`${APIURL}/agency/getAgentDetails?secret_token=${this.props.token}`)
    .then(res => this.setState({ agencyDetails: res.data }, console.log(res)))
  }

  // Post the updated changes to the database
  updateDetails = () => {
      axios.patch(`${APIURL}/agency/updateAgentDetails?secret_token=${this.props.token}`, {
        'name': this.state.updatedDetails.name,
        'addressLine1': this.state.updatedDetails.addressLine1,
        'addressLine2': this.state.updatedDetails.addressLine2,
        'city': this.state.updatedDetails.city,
        'postcode': this.state.updatedDetails.postcode
      }).then(res => {
        window.location.reload()
      })
  }

  // Updating state from form
  handleInput = event => {
    this.state.updatedDetails[event.target.name] = event.target.value
    this.setState({ updatedDetails: this.state.updatedDetails});
  };

  // Dialog open and close
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };


  render () {
    return (
    <div>
    <h1>Agency Details</h1>
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
        <Grid item xs={12}>
          <Paper elevation={3} style={{ width: '70vh', padding: '15px', background: '#EEEEEE'}}>
            <Typography variant="h5">{this.state.agencyDetails.name}</Typography>
            <Typography variant="h5">{this.state.agencyDetails.addressLine1}</Typography>
            <Typography variant="h5">{this.state.agencyDetails.addressLine2}</Typography>
            <Typography variant="h5">{this.state.agencyDetails.city}</Typography>
            <Typography variant="h5">{this.state.agencyDetails.postcode}</Typography>
            <br/>
            <Fab
              variant="extended"
              size="small"
              color="secondary"
              aria-label="edit"
              style={{paddingRight: '15px', paddingLeft: '15px'}}
              onClick={this.handleOpen}
              >
              <EditIcon style={{marginRight: '10px'}} />  Edit details
            </Fab>
          </Paper>
        </Grid>
    </Grid>

    {/* Dialog for editing detaiils of agency */}
    <Dialog
      open={this.state.open}
      onClose={this.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit details</DialogTitle>
      <DialogContent>
        <TextField
          required
          variant="standard"
          value={this.state.updatedDetails.name}
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
          value={this.state.updatedDetails.addressLine1}
          onChange={this.handleInput}
          name="addressLine1"
          margin="dense"
          id="addressLine1"
          label="Address Line 1"
          fullWidth
        />
        <TextField
          required
          variant="standard"
          value={this.state.updatedDetails.addressLine2}
          onChange={this.handleInput}
          name="addressLine2"
          margin="dense"
          id="addressLine2"
          label="Address Line 2"
          fullWidth
        />
        <TextField
          required
          variant="standard"
          value={this.state.updatedDetails.city}
          onChange={this.handleInput}
          name="city"
          margin="dense"
          id="city"
          label="Town/City"
          fullWidth
        />
        <TextField
          required
          variant="standard"
          value={this.state.updatedDetails.postcode}
          onChange={this.handleInput}
          name="postcode"
          margin="dense"
          id="postcode"
          label="Post/zip code"
          fullWidth
        />
      <DialogActions>
        <Button onClick={this.updateDetails}>Update details</Button>
      </DialogActions>
      </DialogContent>
    </Dialog>

    </div>
    )
  }
}

export default ManageAgency
