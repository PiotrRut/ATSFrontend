import React from 'react'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import DialogContentText from '@material-ui/core/DialogContentText'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import DeleteSweepRoundedIcon from '@material-ui/icons/DeleteSweepRounded';
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import APIURL from '../misc/backend.js'
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from '@material-ui/core/FormControl';

import '../App.scss'


class ManageBlanks extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      ranges: [ ],
      newRange: {
        type: '',
        from: '',
        to: ''
      },
      newRangeOpen: false,
    }
  }

  componentDidMount() {
    axios.get(`${APIURL}/blanks/getRange?secret_token=${this.props.token}`)
      .then(res => this.setState({ ranges: res.data }, () => {
        console.log(res)
      }))

    axios.get(`${APIURL}/staff/getAll?secret_token=${this.props.token}`)
      .then(res => this.setState({ salesAdvisors: res.data }))
  }

  handleOpenNewRange = () => {
    this.setState({ newRangeOpen: true })
  }

  handleCloseNewRange = () => {
    this.setState({ newRangeOpen: false })
  }

  addNewRange = () => {
    axios.post(`${APIURL}/blanks/addBlanks?secret_token=${this.props.token}`, {
      'type': this.state.newRange.type,
      'from': this.state.newRange.from,
      'to': this.state.newRange.to,
    })
    .then(res => {
      console.log(res)
      window.location.reload()
    })
    .catch(error => {
      console.log(error)
    });
};

  deleteRange = (_id) => {
      axios.delete(`${APIURL}/blanks/deleteRange?secret_token=${this.props.token}`, {
        data: { '_id': _id }
      }).then(res => {
        window.location.reload()
      })
  }

  handleInput = (event) => {
    this.state.newRange[event.target.name] = event.target.value
    this.setState({ newRange: this.state.newRange })
  }

  render () {
    return (
      <div >
        <h1>Blanks and blank stock</h1>
        { this.state.ranges.length === 1 ?
          <h3>In stock: {this.state.ranges.length} range</h3>
          : <h3>In stock: {this.state.ranges.length} ranges</h3>
        }
        <Button onClick={this.handleOpenNewRange}>Add a new range</Button>
        <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
          <Grid item xs={12}></Grid>
            <Paper elevation={3} style={{ width: '50%', background: '#EEEEEE', marginTop: '20px'}}>
              <List dense>
                {
                  this.state.ranges.map(range => (
                    <ListItem button key={range._id}>
                      <ListItemText
                      primary={`${range.type}-${range.from} -> ${range.type}-${range.to}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => { this.deleteRange(range._id) }} edge="end" aria-label="deleteRange">
                        <DeleteSweepRoundedIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  ))
                }
              </List>
            </Paper>
          </Grid>
        <Dialog
          open={this.state.newRangeOpen}
          onClose={this.handleCloseNewRange}
          aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a new range</DialogTitle>
        <DialogContent>
          <DialogContentText>
            First select type of blank, then provide the first and last blank to be included
          </DialogContentText>
              <FormControl required style={{width: "550px"}}>
              <InputLabel htmlFor="type">Blank type</InputLabel>
                <Select
                  name='type'
                  value={this.state.newRange.type}
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
                <TextField
                  name='from'
                  required
                  label="Range from"
                  onChange={this.handleInput}
                  variant='standard'
                  fullWidth
                />
                <TextField
                  name='to'
                  required
                  label="Range to"
                  onChange={this.handleInput}
                  variant='standard'
                  fullWidth
                />
            <DialogActions>
              <Button onClick={this.addNewRange} variant='small'>
                Add new range
              </Button>
            </DialogActions>
        </DialogContent>
      </Dialog>
      </div>
    )
  }
}

export default ManageBlanks
