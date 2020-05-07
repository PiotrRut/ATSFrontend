import React from 'react'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Grid from '@material-ui/core/Grid'
import DialogContentText from '@material-ui/core/DialogContentText'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import APIURL from '../misc/backend.js'
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from '@material-ui/core/FormControl';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import '../App.scss'

// Assigning blanks to advisors
class AssignBlanks extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      ranges: [ ],
      blanks: [ ],
      blanksFree: [ ],
      staff: [ ],
      userSelected: {
        blanks: []
      },
      userDialog: false,
      newAssignment: {
        type: '',
        from: '',
        to: '',
        assignedTo: '',
        dateAssigned: new Date()
      },
      newAssignmentOpen: false,
    }
  }

  componentDidMount() {
    // Get all the blanks
    axios.get(`${APIURL}/blanks/getAll?secret_token=${this.props.token}`)
      .then(res => this.setState({ blanks: res.data }, () => {
        console.log(res)
      }))

    // Filter out blanks that are not assigned
    axios.get(`${APIURL}/blanks/getAll?secret_token=${this.props.token}`)
      .then(res => res.data.filter(blank => (blank.assignedTo ? false : true)))
      .then(res => this.setState({ blanksFree: res }))

    // Get only staff with the 'Advisor' role
    axios.get(`${APIURL}/staff/getAll?secret_token=${this.props.token}`)
      .then(res => res.data.filter(user => user.role.toString() === 'Advisor'))
      .then(res => this.setState({ staff: res }, () => {
        console.log(res)
      }))

    // Get all the ranges currently stored
    axios.get(`${APIURL}/blanks/getRange?secret_token=${this.props.token}`)
      .then(res => this.setState({ ranges: res.data }, () => {
      console.log(res)
    }))
  }

  // Opening the assign dialog
  handleOpenAssign = () => {
    this.setState({ newAssignmentOpen: true })
  }
  // Closoing the assign dialog
  handleCloseAssign = () => {
    this.setState({ newAssignmentOpen: false })
  }
  // Opening the user dialog
  openUserDialog = () => {
    this.setState({ userDialog: true })
  }
  // Closing the user dialog
  closeUserDialog = () => {
    this.setState({ userDialog: false })
  }

  // Assigning new blanks to an advisor
  assignBlanks = () => {
    axios.post(`${APIURL}/blanks/assignBlanks?secret_token=${this.props.token}`, {
      'type': this.state.newAssignment.type,
      'from': this.state.newAssignment.from,
      'to': this.state.newAssignment.to,
      'assignedTo': this.state.newAssignment.assignedTo
    })
    .then(res => {
      console.log(res)
      window.location.reload()
    })
    .catch(error => {
      console.log(error)
    });
  };

  // Handling the input from the text fields and updating state
  handleInput = (e) => {
    this.state.newAssignment[e.target.name] = e.target.value
    this.setState({ newAssignment: this.state.newAssignment })
  }

  // Handling the input from the date picker
  handleDateInput = (date) => {
    this.state.newAssignment.dateAssigned = date
    this.setState({ newAssignment: this.state.newAssignment })
  }

  render () {
    return (
      <div >
        <h1>Advisor's blank stock</h1>
        <h3>In stock: {this.state.blanks.length} blanks in total ({this.state.blanksFree.length} unassigned) and {this.state.ranges.length} ranges</h3>
        <Button onClick={this.handleOpenAssign}>Assign blanks</Button>
        <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
          <Grid item xs={12}></Grid>
            <Paper elevation={3} style={{ width: '40%', background: '#EEEEEE', marginTop: '20px'}}>
              <List dense>
                {
                  this.state.staff.map(user => (
                    <ListItem button key={user._id} onClick={() => { this.setState({ userSelected: user}, () => { this.openUserDialog()})} }>
                      <ListItemText
                      primary={`${user.name} ${user.surname}`}
                      secondary={` Assigned blanks: ${user.blanks.length} // Press for details`}
                    />
                    <ListItemSecondaryAction>
                    </ListItemSecondaryAction>
                  </ListItem>
                  ))
                }
              </List>
            </Paper>
          </Grid>

        {/*Dialog for assignign new blanks to an advisor*/}
        <Dialog
          open={this.state.newAssignmentOpen}
          onClose={this.handleCloseAssign}
          aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Assign blanks to advisors</DialogTitle>
        <DialogContent>
          <DialogContentText>
            First select type of blank, then the advisor, then the subset of blanks.
            <br/>
            When selecting the subset of a range to assign, use whole numbers.
            <br/>
            For example, use 1 instead of 0000001
          </DialogContentText>
              <FormControl required style={{width: "550px"}}>
                <InputLabel htmlFor="type">Blank type</InputLabel>
                  <Select
                    name='type'
                    value={this.state.newAssignment.type}
                    onChange={this.handleInput}
                    variant='standard'
                    fullWidth
                    autoFocus
                  >
                    <MenuItem value='101'>101 - 1 Coupon - Domestic</MenuItem>
                    <MenuItem value='201'>201 - 2 Coupons  - Domestic</MenuItem>
                    <MenuItem value='420'>420 - 2 Coupons - Intn'l</MenuItem>
                    <MenuItem value='440'>440 - Maunal - Intn'l </MenuItem>
                    <MenuItem value='444'>444 - 4 Coupons - Intn'l</MenuItem>
                  </Select>
              </FormControl>
              <FormControl required style={{width: "550px"}}>
                <InputLabel htmlFor="assignedTo">User to assign</InputLabel>
                  <Select
                    name='assignedTo'
                    value={this.state.newAssignment.assignedTo}
                    onChange={this.handleInput}
                    variant='standard'
                    margin="dense"
                    id="assignedTo"
                    label="assignedTo"
                    fullWidth
                  >
                    { this.state.staff.map(user => (
                      <MenuItem value={user._id}>{user.username} - {user.name} {user.surname} ({user.role})</MenuItem>
                      ))
                    }
                  </Select>
              </FormControl>
                <TextField
                  name='from'
                  required
                  label="Blanks from"
                  value={this.state.newAssignment.from}
                  onChange={this.handleInput}
                  variant='standard'
                  fullWidth
                />
                <TextField
                  name='to'
                  required
                  value={this.state.newAssignment.to}
                  label="Range to"
                  onChange={this.handleInput}
                  variant='standard'
                  fullWidth
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    name="dateAssigned"
                    id="date-picker-dialog"
                    label="Date of assignment"
                    format="yyyy-MM-dd"
                    onChange={this.handleDateInput}
                    value={this.state.newAssignment.dateAssigned}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
            <DialogActions>
              <Button onClick={this.assignBlanks} variant='small'>
                Assign blanks
              </Button>
            </DialogActions>
        </DialogContent>
      </Dialog>

      {/*Displaying all blanks assigned to an advisor*/}
      <Dialog
        open={this.state.userDialog}
        onClose={this.closeUserDialog}
        aria-labelledby="form-dialog-title"
        scroll="paper"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-title">Blanks assigned to {this.state.userSelected.name}</DialogTitle>
        <DialogContent>
          <DialogContent dividers>
              {
                this.state.userSelected.blanks.map(blank => (
                  <DialogContentText style={{ textAlign: "center" }}>
                    {blank.type}{blank.number} {blank.void} {blank.sold}
                    </DialogContentText>
                ))
              }
          </DialogContent>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

      </div>
    )
  }
}

export default AssignBlanks
