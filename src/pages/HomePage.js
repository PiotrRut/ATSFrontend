import React from 'react';
import '../App.scss';
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import MaintainStaff from '../adminTools/maintainStaff'
import ManageAgency from '../adminTools/manageAgency'
import ManageBlanks from '../adminTools/manageBlanks'
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import BackupRoundedIcon from '@material-ui/icons/BackupRounded';
import PictureAsPdfRoundedIcon from '@material-ui/icons/PictureAsPdfRounded';
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';
import Backup from '../adminTools/dbBackup'

import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import LocalOfferRoundedIcon from '@material-ui/icons/LocalOfferRounded';
import ExchangeRate from '../managerTools/ExchangeRate';
import CommissionRate from '../managerTools/CommissionRate'
import Discounts from '../managerTools/Discounts'
import AssignBlanks from '../managerTools/AssignBlanks'

import LocalAirportRoundedIcon from '@material-ui/icons/LocalAirportRounded';
import MaintainCustomers from '../saleTools/maintainCustomers'
import Sale from '../saleTools/Sale'


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
  let components;
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  // Create administrator views
  if (props.staffRole === 'Admin') {
    components = [
    <TabPanel key={'ManageStaff'} value={value} index={0} dir={theme.direction}>
      <MaintainStaff staffRole={props.staffRole} token={props.token} username={props.username} />
    </TabPanel>,
    <TabPanel key={'BackupDatabase'} value={value} index={1} dir={theme.direction}>
      <Backup staffRole={props.staffRole} token={props.token} username={props.username}/>
    </TabPanel>,
    <TabPanel key={'ManageBlankStock'} value={value} index={2} dir={theme.direction}>
      <ManageBlanks staffRole={props.staffRole} token={props.token} username={props.username}/>
    </TabPanel>,
    <TabPanel key={'CreateReports'} value={value} index={3} dir={theme.direction}>
    </TabPanel>,
    <TabPanel key={'ManageAgency'} value={value} index={4} dir={theme.direction}>
      <ManageAgency token={props.token}/>
    </TabPanel>,
    ]
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
  } else if (props.staffRole === 'Manager') {
    components = [
    <TabPanel key={'ExchangeRate'} value={value} index={0} dir={theme.direction}>
      <ExchangeRate user={props.staffRole} token={props.token}/>
    </TabPanel>,
    <TabPanel key={'AssignBlanks'} value={value} index={1} dir={theme.direction}>
      <AssignBlanks staffRole={props.staffRole} token={props.token} username={props.username}/>
    </TabPanel>,
    <TabPanel key={'CreateReports'} value={value} index={2} dir={theme.direction}>
    </TabPanel>,
    <TabPanel key={'RefundLogs'} value={value} index={3} dir={theme.direction}>
    </TabPanel>,
    <TabPanel key={'CommissionRate'} value={value} index={4} dir={theme.direction}>
      <CommissionRate token={props.token}/>
    </TabPanel>,
    <TabPanel key={'CustomerDiscount'} value={value} index={5} dir={theme.direction}>
      <Discounts user={props.staffRole} token={props.token}/>
    </TabPanel>
    ]
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
  } else if (props.staffRole === 'Advisor') {
    components = [
    <TabPanel key={'ExchangeRate'} value={value} index={0} dir={theme.direction}>
      <ExchangeRate user={props.staffRole} token={props.token}/>
    </TabPanel>,
    <TabPanel key={'MaintainCustomers'} value={value} index={1} dir={theme.direction}>
      <MaintainCustomers user={props.staffRole} token={props.token}/>
    </TabPanel>,
    <TabPanel key={'NewSale'} value={value} index={2} dir={theme.direction}>
        <Sale user={props.staffRole} token={props.token} mongoID={props.mongoID}/>
    </TabPanel>
    ]
    tabs = [
      'Exchange Rate',
      'Maintain Customers',
      'New Sale'
    ]
    icons = [
      <MonetizationOnRoundedIcon/>,
      <GroupRoundedIcon/>,
      <LocalAirportRoundedIcon/>
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
        >
          {
            tabs.map((key, index) => (
              <Tab key={index} label={tabs[index]} {...a11yProps(index)} icon={icons[index]} />
            ))
          }
        </Tabs>
      </AppBar>
      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
        {components}
      </SwipeableViews>
    </div>
  )
}
