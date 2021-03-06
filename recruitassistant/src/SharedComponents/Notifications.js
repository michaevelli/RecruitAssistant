import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Divider, Menu, MenuItem, Typography, CircularProgress, Badge, Link, withStyles } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Card,Col,Row,} from 'react-bootstrap';
import axios from "axios";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -4,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

export default function Notifications() {
  const [notif, setNotif] = useState([])
  const [notifLength, setLength] = useState(0)
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true)

  const checkUrl = "http://localhost:5000/checknotif"
  const delUrl = "http://localhost:5000/remnotif"
  const recUrl = "http://localhost:5000/recnotif"


  useEffect(() => {
      // checkSeen()
      getData()
      const interval = setInterval(() => {
        getData()
      }, 300000);
      return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // setting which data to retrieve
  const getData = async() => {
    const data={
      uid : sessionStorage.getItem("uid")
    }

    await axios.post(checkUrl, data)
			.then(res => {
        handleData(res.data.data)
        setLoading(false)
        // setNotif(res.data.data)
			})
			.catch((error) => {
        console.log(error)
			})	
  }


  // update the notifications whenever an unviewed notif is retrieved
  const handleData = (data) => {
    var count = 0
    if(data != null){
      for(var i = 0; i < data.length; i++){
        if(data[i][1]["seen"] !== true){
          count++;
        }
      }
      setLength(count)
      setNotif(data)
    }
    else{
      setLength(0)
      renderNotif()
    }
  }

  // function that records the list of notifications that have been seen
  // reroute to update function in backend
  const recordNotif = async(list) => {
    const data={
      uid: sessionStorage.getItem("uid"),
      list: list
    }

    await axios.post(recUrl, data)
      .then(res => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })	
  }

  const deleteNotif = async(id) => {
    setLoading(true)
    const data={
      id : id,
      uid: sessionStorage.getItem("uid"),
    }
    await axios.post(delUrl, data)
			.then(res => {
        console.log(res)
        notif.length--
        getData()
			})
			.catch((error) => {
        console.log(error)
			})	
  }

  const handleOpen = (event) => {
    setOpen(true)
    setAnchorEl(event.currentTarget);
    var list_seen = []
    notif.forEach((data) => {
      list_seen.push(data[0])
    });
    // record in db which notifications have been viewed
    recordNotif(list_seen)
    setLength(0)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null);
  }

  const renderNotifText = (type, url) => {
    if (type === "offer update") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>job offer</Link> has been updated!
        </Typography>
      )
    } else if (type === "accepted offer") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>job offer</Link> has been accepted!
        </Typography>
      )
    } else if (type === "counter offer") {
      return (
        <Typography color="textSecondary">
          Your job offer has received a <Link href={url}>counter offer</Link>
        </Typography>
      )
    } else if (type === "interview") {
      return (
        <Typography color="textSecondary">
          You have a new <Link href={url}>interview</Link>!
        </Typography>
      )
    } else if (type === "accepted interview") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>interview</Link> has been accepted!
        </Typography>
      )
    } else if (type === "declined interview") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>interview</Link> has been declined
        </Typography>
      )
    } else if (type === "declined offer") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>job offer</Link> has been declined
        </Typography>
      )
    } else if (type === "rejected offer") {
      return (
        <Typography color="textSecondary">
          Your <Link href={url}>job offer</Link> has been rejected
        </Typography>
      )
    } else {
      return (
        <Typography color="textSecondary">
          {type}
        </Typography>
      )
      
    }
  }


  const renderNotif = () => {
    if(loading){
      return ( 
        <MenuItem style={{display:'flex', justifyContent:'center', height:200}}>
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
            }}>
            <CircularProgress/>
          </div>
        </MenuItem>
      )
    } else if(notif.length === 0){
      return ( 
        <MenuItem style={{display:'flex', justifyContent:'center'}}>
          <Typography color="textSecondary">
            Nothing to view!
          </Typography>
        </MenuItem>
      )
    }
    else{
      return notif.map(data => (
        <div>
        <MenuItem style={data[1].seen ? {backgroundColor:'lightgrey', opacity:"0.7", cursor: 'default'} : {cursor: 'default'}} divider>
          <Card.Body>
            <Row>
              <Col xs={10} style={{whiteSpace:'initial'}}>
                {renderNotifText(data[1].type, data[1].url)}
                <Typography color="textSecondary">
                  {data[1].date_time}
                </Typography>
              </Col>
              <Col xs={2}>
                <IconButton aria-label="delete" onClick={() => {deleteNotif(data[0])}}>
                  <CancelIcon />
                </IconButton>
              </Col>
            </Row>
          </Card.Body>
        </MenuItem>
        <Divider/>
        </div>
      ));

    }
  }

  return(
    <>
    <IconButton aria-label="alerts" onClick={handleOpen} >
      <StyledBadge badgeContent={notifLength} color="secondary">
        <NotificationsIcon></NotificationsIcon>
      </StyledBadge>
    </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        PaperProps={{
          style: {
            width: '400px'
          },
        }}
      >
        {/* <MenuItem>a</MenuItem>
        <MenuItem>a</MenuItem>
        <MenuItem>a</MenuItem> */}
      {renderNotif()}
      </Menu>

    </>
  );
};