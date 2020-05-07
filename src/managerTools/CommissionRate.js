import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import DeleteSweepRoundedIcon from '@material-ui/icons/DeleteSweepRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from '@material-ui/core/FormControl';

// Adding and removing the commission rates
class CommissionRate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      commissionRates: [],
      newRate: {
        rate: '',
        type: ''
      },
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
          rate: this.state.newRate.rate,
          type: this.state.newRate.type
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
  handleInput = event => {
    this.state.newRate[event.target.name] = event.target.value
    this.setState({ newRate: this.state.newRate});
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
                  <ListItemText secondary={`Blanks of type ${rate.type} - ${rate.rate}% commission`} />
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
      </Grid>
      <FormControl style={{width: "250px", textAlign: "left"}}>
        <InputLabel htmlFor="number">Type of blank</InputLabel>
        <Select
          name='type'
          value={this.state.newRate.type}
          onChange={this.handleInput}
          variant='standard'
          margin="dense"
          id="type"
          label="Type of blank"
          fullWidth
        >
          <MenuItem value='101'>101</MenuItem>
          <MenuItem value='201'>201</MenuItem>
          <MenuItem value='420'>420</MenuItem>
          <MenuItem value='440'>440</MenuItem>
          <MenuItem value='444'>444</MenuItem>
        </Select>
      </FormControl>
          <TextField
           id="standard-basic"
           label="Add a new rate (%)"
           name="rate"
           value={this.state.newRate.rate}
           helperText={`Numbers only`}
           onChange={this.handleInput}
           style={{width: '250px'}}
           />
           <br/>
           <Button variant="small"
             disabled={this.state.newRate.rate <= 0}
             startIcon={<TrendingUpRoundedIcon/>}
             onClick={this.addCommissionRate}>
             Add a new rate
          </Button>
    </Grid>
    </div>
    )
  }
}

export default CommissionRate
