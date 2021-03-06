import React from 'react'
import axios from 'axios'
import APIURL from '../misc/backend.js'
import '../App.scss'
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'

// Database backup and restore
class Backup extends React.Component {
  constructor (props) {
    super(props)
  }


  // Post the backup request to the db
  backupDB = () => {
      axios.post(`${APIURL}/backup/backupdb?secret_token=${this.props.token}`
        ).then(res => {
        window.location.reload()
        console.log(res)
      })
  }

  // Restore from the last backup
  restoreDB = () => {
      axios.post(`${APIURL}/backup/restoredb?secret_token=${this.props.token}`
          ).then(res => {
          window.location.reload()
      })
  }


  render () {
    return (
    <div>
    <h1>Database Backup</h1>
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
        <Grid item xs={3}>
            <Button onClick={this.backupDB}>
               Backup Database
            </Button>
            <Button onClick={this.restoreDB}>
               Restore from backup
            </Button>
        </Grid>
    </Grid>
    </div>
    )
  }
}

export default Backup
