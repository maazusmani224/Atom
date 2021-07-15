import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Button} from 'semantic-ui-react';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import {Icon} from 'semantic-ui-react'
import './SignUpForm.css'
import {db,auth} from '../firebase'

function SignUpForm(props)
{
    const [errmessage,setErrMessage]  = useState('')
    const [snackbaropen, setSnackBarOpen] = useState(false);
    const [profession,setProfession] = useState('student');
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    function handleChange(event)
    {
        setProfession (event.target.value);
    }
/*handles the signup*/
    function signUp()
    {
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
                db.collection('users').doc(email).set({
                    username : username,
                    profession:profession,
                    photoUrl:""
                });

            return authUser.user.updateProfile(
                {
                    displayName: username
                }
            );
        })
        .catch((error)=>{
            setErrMessage(error.message)
            setSnackBarOpen(true);
        });
        props.Close();
        setPassword('') //closes the signup dialog
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackBarOpen(false);
      };

    return(
        <div className='signup__form'>
            <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}} open={snackbaropen} autoHideDuration={3000} onClose={handleSnackBarClose}>
              <MuiAlert elevation={5} variant='filled' onClose={handleSnackBarClose} severity="error">
               {errmessage}
              </MuiAlert>
            </Snackbar>
            <Dialog open={props.open} onClose={props.Close} aria-labelledby="form-dialog-title">
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <RadioGroup row={true} aria-label="profession" value={profession} onChange={handleChange}>
                       <FormControlLabel value="student" control={<Radio />} label="Student" />
                       <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                    </RadioGroup>
                    <div className="signup__email">
                       <TextField required type="email" value={email} label="Email" defaultValue="" onInput={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    <div className="signup__username">
                       <TextField required autoComplete="off" id="standard-required" label="Username" value={username} onInput={(e)=>{setUsername(e.target.value)}}/>
                    </div>
                    <div className="signup__password">
                       <TextField required type="password" name="pass" value={password} label="Password" onInput={(e)=>{setPassword(e.target.value)}} />
                    </div>
                    <div className="signup__submit">
                       <div className="signup__button">
                       <Button basic
                       color = "blue"
                       onClick={signUp}>Sign Up</Button>
                       </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SignUpForm;