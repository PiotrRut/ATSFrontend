import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import DeleteSweepRoundedIcon from '@material-ui/icons/DeleteSweepRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import Grow from '@material-ui/core/Grow';

class CommissionRate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      commissionRates: [],
      newRate: '',
      checked: false,
    }
  }

  // Get the commission rates on component mount and set state
  componentDidMount() {
    axios.get(`${APIURL}/commissions/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ commissionRates: res.data }, console.log(res)))
  }

  // Add new comission rate
  addCommissionRate = () => {
      axios.post(`${APIURL}/commissions/addRate?secret_token=${this.props.token}`, {
          rate: this.state.newRate
      }).then(res => {
        window.location.reload()
        console.log(res)
      })
  }

  // Delete a comission rate
  deleteCommissionRate = (_id) => {
      axios.delete(`${APIURL}/commissions/delete?secret_token=${this.props.token}`, {
        data: { '_id': _id }
      }).then(res => {
        window.location.reload()
      })
  }

  // Updating state and validating input from the text field
  handleInput = (e) => {
    this.setState({ newRate: e.target.value});
  };


  render () {
    return (
    <div>
    <h1>These commission rates are currently available: </h1>
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
      <Grid item xs={12}>
        <Paper elevation={3} style={{ width: '50vh', padding: '15px', background: '#EEEEEE', margin: '15px'}}>
          <List dense button>
            {
              this.state.commissionRates.map(rate => (
                <ListItem key={rate._id}>
                  <ListItemText secondary={`Commission rate - ${rate.rate}%`}/>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments"
                      onClick={() => {this.deleteCommissionRate(rate._id)}}
                    >
                      <DeleteSweepRoundedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            }
          </List>
        </Paper>
          <TextField
           id="standard-basic"
           label="Add a new rate (%)"
           value={this.state.newRate}
           helperText={`Numbers only`}
           onChange={this.handleInput}
           style={{width: '250px'}}
           />
           <br/> <br/>
           <Button variant="small"
             disabled={this.state.newRate <= 0}
             startIcon={<TrendingUpRoundedIcon/>}
             onClick={this.addCommissionRate}>
             Add a new rate
          </Button>
      </Grid>
    </Grid>
    </div>
    )
  }
}

export default CommissionRate
