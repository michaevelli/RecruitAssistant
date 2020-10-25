import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid, Modal, Dialog, Fade, Backdrop,CardContent, CardActions } from "@material-ui/core";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Card, Container,Col,Row,} from 'react-bootstrap';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow:'scroll',
    maxHeight: '100vh',

  },
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

  const checkUrl = "http://localhost:5000/checknotif"
  const delUrl = "http://localhost:5000/remnotif"


  useEffect(() => {
    // used to preserve notifications across all windows
      if(localStorage.getItem("seenNotif") !== null){
        var a = localStorage.getItem("seenNotif").split(",")
        for(var i = 0; i < a.length; i++){
          seen.push(a[i])
        }
      }
      else{
        getData()
      }
      
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

  const handleOpen = () => {
    setOpen(true)
    notif.map((data) => {
      if(!seen.includes(data[0])){
        seen.push(data[0])
      }
    });
    localStorage.setItem("seenNotif", seen)
    setLength(0)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteNotif = async(id) => {
    const data={
      id : id
    }
    console.log("deleting" + id)

    await axios.post(delUrl, data)
			.then(res => {
        console.log(res)
        getData()
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
                    Please click on the following link to see it in more details.
                  </Typography>
                  <br></br>
                  <Typography color="textSecondary">
                    Regards,
                    RecruitAssistant Team.
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
    {/* <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
    
      <Fade in={open}>
        <div className={classes.paper}>
          {renderNotif()}
        </div>
      </Fade>
    </Modal> */}

    <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
             {renderNotif()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

    </>
  );
};