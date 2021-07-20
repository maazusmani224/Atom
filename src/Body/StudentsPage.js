import React,{useEffect, useState} from 'react';
import StudentClass from './StudentClass';
import StudentClassFeeds from './StudentClassFeeds';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import Test from './Test';
import {auth} from '../firebase'

export default function StudentsPage(){
    const [errmessage,setErrMessage]  = useState(`Logged in as ${auth.currentUser.displayName}`);
    const [snackbaropen, setSnackBarOpen] = useState(true);
    const [classopened,setClassOpened]=useState(false);
    const [openedclassid,setOpenedClassId] = useState("");
    const [teststarted,setTestStarted]= useState(false);
    const [testid,setTestId] = useState('');
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        setTimeout(()=>setSnackBarOpen(false),3000);
    },[])

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackBarOpen(false);
      };

    return (
        <div>
             <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={snackbaropen} autoHideDuration={3000} onClose={handleSnackBarClose}>
              <MuiAlert elevation={5} variant='filled' onClose={handleSnackBarClose} severity="success">
               {errmessage}
               </MuiAlert>
            </Snackbar>

        {!teststarted?
        (classopened?
        <StudentClassFeeds setTestId={setTestId} setTestStarted={setTestStarted} loading={loading} setLoading={setLoading} classid={openedclassid} setClassOpened={setClassOpened} setOpenedClassId={setOpenedClassId}/>:
        <StudentClass setClassOpened={setClassOpened} setOpenedClassId={setOpenedClassId} loading={loading} setLoading={setLoading}/>
        ):
        <Test setTestStarted={setTestStarted} testid={testid}/>}
        </div>
    );
}