import React from 'react';
import '../App.scss';
import MaintainStaff from '../adminTools/maintainStaff'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

// Admin tab icons
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import BackupRoundedIcon from '@material-ui/icons/BackupRounded';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';

// Manager tab icons
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import LocalOfferRoundedIcon from '@material-ui/icons/LocalOfferRounded';
import ExchangeRate from '../managerTools/ExchangeRate';

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}))

export default function FullWidthTabs (props) {
  const classes = useStyles()
  const theme = useTheme()
  var tabs = []
  var icons = []
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  let allTabs;
  // Create administrator views
  if (props.staffRole == 'Admin') {
    allTabs =
    <TabPanel key={'ManageStaff'} value={value} index={0} dir={theme.direction}>
      <MaintainStaff staffRole={props.staffRole} token={props.token} username={props.username} />
    </TabPanel>
    tabs = [
      'Manage Employees',
      'Backup Database',
      'Manage Blank Stock',
      'Create Reports',
      'Manage Agency'
    ]
    icons = [
      <GroupRoundedIcon/>,
      <BackupRoundedIcon/>,
      <StorageRoundedIcon/>,
      <PictureAsPdfRoundedIcon/>,
      <ContactMailRoundedIcon/>
    ]
    // Create manager views
  } else if (props.staffRole == 'Manager') {
    allTabs =
    <TabPanel key={'ExchangeRate'} value={value} index={0} dir={theme.direction}>
      <ExchangeRate user={props.staffRole} token={props.token}/>
    </TabPanel>
    tabs = [
      'Exchange Rate',
      'Assign Blanks',
      'Create Reports',
      'Refund Logs',
      'Comission Rates',
      'Customer Discounts'
    ]
    icons = [
      <MonetizationOnRoundedIcon/>,
      <PersonAddRoundedIcon/>,
      <PictureAsPdfRoundedIcon/>,
      <ReceiptRoundedIcon/>,
      <TrendingUpRoundedIcon/>,
      <LocalOfferRoundedIcon/>
    ]
    // Create travel advisor views
  } else if (props.staffrole == 'Advisor') {
    allTabs =
    <TabPanel key={'ExchangeRate'} value={value} index={0} dir={theme.direction}>
      <ExchangeRate user={props.staffRole} token={props.token}/>
    </TabPanel>
    tabs = [
      'Exchange Rate'
    ]
    icons = [
      <MonetizationOnRoundedIcon/>
    ]
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#424242", position: "fixed", bottom:"0", width:"100%" }} >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="white"
          variant="fullWidth"
          aria-label="staff-action-tabs"
        >
          {
            tabs.map((name, index) => (
              <Tab key={index} label={tabs[index]} {...a11yProps(index)} icon={icons[index]} />
            ))
          }
        </Tabs>
      </AppBar>
      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
        {allTabs}
      </SwipeableViews>
    </div>
  )
}
