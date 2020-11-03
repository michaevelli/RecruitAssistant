import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid, Modal, Dialog, Fade, Backdrop,CardContent, CardActions } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';


import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Card, Container,Col,Row,} from 'react-bootstrap';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

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
  const classes = useStyles()
  const [seen, setSeen] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);

  const checkUrl = "http://localhost:5000/checknotif"
  const delUrl = "http://localhost:5000/remnotif"
  const recUrl = "http://localhost:5000/recnotif"


  useEffect(() => {
      checkSeen()
      getData()
      const interval = setInterval(() => {
        getData()
      }, 5000);
      return () => clearInterval(interval);
    }, []);

  
  const getData = async() => {
    const data={
      uid : sessionStorage.getItem("uid")
    }

    await axios.post(checkUrl, data)
			.then(res => {
        handleData(res.data.data)
			})
			.catch((error) => {
        console.log(error)
			})	
  }

  // update the notifications whenever an unviewed notif is retrieved
  const handleData = (data) => {
    var count = 0
    for(var i = 0; i < data.length; i++){
      if(!seen.includes(data[i][0])){
        count++;
      }
    }
    setLength(count)
    setNotif(data)
  }

  const handleOpen = (event) => {
    setOpen(true)
    setAnchorEl(event.currentTarget);

    notif.map((data) => {
      if(!seen.includes(data[0])){
        seen.push(data[0])
      }
    });
    // record in db which notifications have been viewed
    recordNotif(seen)
    setLength(0)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null);
  }

  const deleteNotif = async(id) => {
    const data={
      id : id,
      uid: sessionStorage.getItem("uid"),
    }
    await axios.post(delUrl, data)
			.then(res => {
        console.log(res)
        getData()
			})
			.catch((error) => {
        console.log(error)
			})	
  }

  // function that records the list of notifications that have been seen
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

  // function that is run on page reload and gets the list of notifications user has seen
  const checkSeen = async() => {
    await axios.get(recUrl, {
			params: {
				uid: sessionStorage.getItem("uid")
			}})
      .then(res => {
        for(var i = 0; i < res.data.data[0][1].list.length; i++){
          seen.push(res.data.data[0][1].list[i])
        }
      })
      .catch((error) => {
        console.log(error)
      })	
  }


  const renderNotif = () => {
    if(notif.length == 0){
      return ( 
        <>
          <Typography color="textSecondary">
            Nothing to view!
          </Typography>
        </>
      )
    }
    else{
      return notif.map(data => (
        <Card style={{margin: 2}}>
          <CardContent>
          <CardActions style={{ width: '100%', justifyContent: 'flex-end' }}>
            <IconButton aria-label="delete" onClick={() => {deleteNotif(data[0])}}>
              <DeleteIcon />
            </IconButton>    
          </CardActions>
                                
            <Grid>
              <Row>
                <Col>
                  <Typography variant="h5" component="h2">
                    Hi {localStorage.getItem("name")}!
                  </Typography>
                  <br></br>
                  <Typography color="textSecondary">
                    You have an urgent {data[1].type} to view!
                  </Typography>
                  <br></br>
                  <Typography color="textSecondary">
                    Please make sure to check it out for more details!
                  </Typography>
                  <br></br>
                  <Link href={data[1].url}>
                      Link
                  </Link>
                  <br></br>
                  <Typography color="textSecondary">
                    Regards,
                    RecruitAssistant Team.
                  </Typography>
                  <br></br>
                  <Typography color="textSecondary">
                    {data[1].date_time}
                  </Typography>
                </Col>
              </Row>
            </Grid>
          </CardContent>
        </Card>
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
        PaperProps={{
          style: {
            // maxHeight: ITEM_HEIGHT * 4.5,
            width: '300px',
          },
        }}
      >
      {renderNotif()}
      </Menu>

    </>
  );
};