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



const styles = theme => ({
  root: {
    minWidth: 100,
    maxWidth: 300,
    height: 200,
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


class MaintainStaff extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allUsers: [],
      open: false,
      newEmployee: {
        name: '',
        surname: '',
        role: '',
        username: '',
        password: ''
      }
     }
  }

  // Fetch a list of all users when the component mounts
  componentDidMount() {
    axios.get(`${APIURL}/staff/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allUsers: res.data }, console.log(res)))
  }

  // Post the entered user details to backend
  registerSubmit = () => {
    axios.post(`${APIURL}/auth/register?secret_token=${this.props.token}`, {
      name: this.state.newEmployee.name,
      surname: this.state.newEmployee.surname,
      role: this.state.newEmployee.role,
      username: this.state.newEmployee.username,
      password: this.state.newEmployee.password
    })
      .then(response => {
        console.log(response)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      });
  };

  // Updating user details
  handleInput = event => {
    this.state.newEmployee[event.target.name] = event.target.value
    this.setState({ newEmployee: this.state.newEmployee});
  };

  // Dialog open and close
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render () {
    const { classes } = this.props;
    return (
      <div>
        <h1>Staff management:</h1>
        <Button color="blue" onClick={this.handleOpen}>
          Register a new employee
        </Button>
        <br/> <br/>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              {
                this.state.allUsers.map(user => (
                  <Card className={classes.root} variant="outlined" >
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {user.name} {user.surname}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Role: {user.role}
                      </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Delete User</Button>
                    </CardActions>
                    <CardActions>
                        <Button size="small">Update User</Button>
                    </CardActions>
                  </Card>
                ))
              }
            </Grid>
          </Grid>
        </Grid>

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
              value={this.state.newEmployee.name}
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
              value={this.state.newEmployee.surname}
              onChange={this.handleInput}
              name="surname"
              margin="dense"
              id="surname"
              label="Surname"
              fullWidth
            />
            <FormControl required style={{width: "550px"}}>
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              name='role'
              value={this.state.newEmployee.role}
              onChange={this.handleInput}
              variant='standard'
              margin="dense"
              id="role"
              label="Role"
              fullWidth
            >
              <MenuItem value='Admin'>Admin</MenuItem>
              <MenuItem value='Manager'>Office Manager</MenuItem>
              <MenuItem value='Advisor'>Sales Advisor</MenuItem>
            </Select>
            </FormControl>
            <TextField
              required
              variant="standard"
              value={this.state.newEmployee.username}
              onChange={this.handleInput}
              name="username"
              margin="dense"
              id="username"
              label="Username"
              fullWidth
            />
            <TextField
              required
              variant="standard"
              value={this.state.newEmployee.password}
              onChange={this.handleInput}
              name="password"
              margin="dense"
              id="password"
              label="Password"
              fullWidth
            />
          <DialogActions>
            <Button onClick={this.registerSubmit}>Register</Button>
          </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

MaintainStaff.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (MaintainStaff);
