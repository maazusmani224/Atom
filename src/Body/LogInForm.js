import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import { Button } from "semantic-ui-react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Icon } from "semantic-ui-react";
import "./LoginForm.css";
import { db, auth } from "../firebase";

function LogInForm(props) {
  const [errmessage, setErrMessage] = useState("");
  const [snackbaropen, setSnackBarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /*Handles the signup button */
  function signUp() {
    props.Close();
    props.signupOpen();
  }
  /*Handles the signin button */
  function signIn() {
    auth.signInWithEmailAndPassword(email, password).catch((err) => {
      setErrMessage(err.message);
      setSnackBarOpen(true);
    });
    props.Close();
    setPassword("");
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <div className="login__form">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbaropen}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
      >
        <MuiAlert
          elevation={5}
          variant="filled"
          onClose={handleSnackBarClose}
          severity="error"
        >
          {errmessage}
        </MuiAlert>
      </Snackbar>
      <Dialog
        open={props.open}
        onClose={props.Close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <div className="login__username">
            <TextField
              autoComplete="off"
              required
              id="standard-required"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="login__password">
            <TextField
              required
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="login__submit">
            <Button basic color="red" onClick={signIn}>
              Sign In
            </Button>
          </div>
          <div className="login__signup">
            <FormLabel component="legend">
              Dont have an account? Sign up Now.
            </FormLabel>
            <div className="signup__button">
              <Button basic color="blue" onClick={signUp}>
                Sign Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LogInForm;
