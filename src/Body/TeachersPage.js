import React, { useState, useEffect } from "react";
import TeacherClass from "./TeacherClass";
import TeacherClassFeeds from "./TeacherClassFeeds";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { auth } from "../firebase";

export default function TeachersPage() {
  const [errmessage, setErrMessage] = useState(
    `Logged in as ${auth.currentUser.displayName}`
  );
  const [snackbaropen, setSnackBarOpen] = useState(true);
  const [classopened, setClassOpened] = useState(false);
  const [openedclassid, setOpenedClassId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setSnackBarOpen(false), 3000);
  }, []);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <div>
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
          severity="success"
        >
          {errmessage}
        </MuiAlert>
      </Snackbar>
      {classopened ? (
        <TeacherClassFeeds
          key={101}
          loading={loading}
          setLoading={setLoading}
          classid={openedclassid}
          setClassOpened={setClassOpened}
          setOpenedClassId={setOpenedClassId}
        />
      ) : (
        <TeacherClass
          key={201}
          loading={loading}
          setLoading={setLoading}
          setClassOpened={setClassOpened}
          setOpenedClassId={setOpenedClassId}
        />
      )}
    </div>
  );
}
