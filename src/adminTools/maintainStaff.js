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


const styles = theme => ({
  root: {
    minWidth: 100,
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


class MaintainStaff extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      allUsers: [],
      staffRole: props.staffRole,
      open: false,
      openUpdate: false,
      newEmployee: {
        name: '',
        surname: '',
        role: '',
        username: '',
        password: ''
      },
      editedEmployee: {
        name: '',
        surname: '',
        role: '',
        username: '',
        password: ''
      },
      checked: false,
      setChecked: false
     }
  }

  // Fetch a list of all users when the component mounts
  componentDidMount() {
    axios.get(`${APIURL}/staff/getAll?secret_token=${this.props.token}`)
    .then(res => this.setState({ allUsers: res.data }, console.log(res)))
    console.log(this.state.allUsers)
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

  deleteUser = (username) => {
    axios.delete(`${APIURL}/staff/deleteUser?secret_token=${this.props.token}`, {
        data: {username: username}
    })
      .then(response => {
        console.log(response)
        console.log(this.props.usernamee)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        console.log(this.props.username)
      });
  };

  updateUser = (oldUsername) => {
    axios.patch(`${APIURL}/staff/updateUser?secret_token=${this.props.token}`, {
      data : { 
      name: this.state.editedEmployee.name,
      surname: this.state.editedEmployee.surname,
      role: this.state.editedEmployee.role,
      oldUsername: oldUsername,
      newUsername: this.state.editedEmployee.username,
      password: this.state.editedEmployee.password 
      } 
    })
      .then(response => {
        console.log(response)
        window.location.reload()
        console.log(oldUsername)
      })
      .catch(error => {
        console.log(error)
        console.log(oldUsername)
      });
  }

  // Updating user details for new employees
  handleInput = event => {
    this.state.newEmployee[event.target.name] = event.target.value
    this.setState({ newEmployee: this.state.newEmployee});
  };

   // Updating user details for updating employees
   handleChangeInput = event => {
    this.state.editedEmployee[event.target.name] = event.target.value
    this.setState({ editedEmployee: this.state.editedEmployee});
  };

  // Dialog open and close
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  
  // Dialog open and close for updating users
  handleOpenUpdate = () => {
    this.setState({ openUpdate: true });
  };
  handleCloseUpdate = () => {
    this.setState({ openUpdate: false });
  };

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
        <h1>Staff management:</h1>
        <h3>Number of registered employees: {this.state.allUsers.length}</h3>
        <Button color="blue" onClick={this.handleOpen}>
          Register a new employee
        </Button>
        <br/> <br/>

        <FormControlLabel
        control={<Switch checked={this.state.checked} onChange={this.handleCheckButton} />}
        label="Show/hide employee list"
        style={{color: 'black'}}
        />
        <Grow in={this.state.checked}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={1}>
              {
                this.state.allUsers.map(user => (
                  <div>
                  <Card className={classes.root} variant="outlined" >
                    <CardContent>
                      { (user.username === this.props.username) ?
                        <Typography variant="h5" component="h2" gutterBottom>
                        {user.name} {user.surname} (You)
                        </Typography>
                        : <Typography variant="h5" component="h2" gutterBottom>
                        {user.name} {user.surname}
                        </Typography>
                      }
                      <Typography variant="body2" component="p">
                        Role: {user.role}
                      </Typography>
                      <Typography variant="body2" className={classes.pos} color="textSecondary">
                        Username: {user.username}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'center' }}>
                        <Button size="small" onClick={() => {this.deleteUser(user.username)}}>Delete User</Button>
                        <Button size="small" onClick={this.handleOpenUpdate}>Update User</Button>
                    </CardActions>
                  </Card>
                </div>                 
                ))
              }
            </Grid>
          </Grid>
        </Grid>
        </Grow>

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
