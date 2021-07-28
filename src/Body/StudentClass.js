import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  Divider,
  Card,
  Button,
  Icon,
  Input,
  Transition,
  CardGroup,
  Label,
  Placeholder,
} from "semantic-ui-react";
import * as firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./StudentClass.css";

export default function StudentClass(props) {
  const [errmessage, setErrMessage] = useState(
    `Logged in as ${auth.currentUser.displayName}`
  );
  const [snackbaropen, setSnackBarOpen] = useState(true);
  const [severity, setSeverity] = useState("success");
  const [classes, setClasses] = useState([]);
  const [inputclasscode, setInputClassCode] = useState("");
  const user = auth.currentUser;
  const colors = ["black", "teal", "blue", "red", "olive", "green", "violet"];
  const gradients = [
    "linear-gradient(to right, #232526, #414345)",
    "linear-gradient(to right, #1f1c2c, #928dab)",
    "linear-gradient(to right, #1e130c, #9a8478)",
    "linear-gradient(to right, #8e0e00, #1f1c18)",
    "background: linear-gradient(to right, #000000, #434343);",
    "linear-gradient(to right, #141e30, #243b55)",
    "linear-gradient(to right, #200122, #6f0000)",
    "linear-gradient(to right, #536976, #292e49)",
    "linear-gradient(to right, #bdc3c7, #2c3e50)",
  ];

  useEffect(() => {
    const unsubscribe = db
      .collection("partof")
      .where("student", "==", user.email)
      .orderBy("joined", "desc")
      .onSnapshot((snap) => {
        getClasses();
      });
    setSnackBarOpen(false);
    return () => {
      unsubscribe();
      props.setLoading(true);
    };
  }, []);

  function getClasses() {
    db.collection("partof")
      .where("student", "==", user.email)
      .orderBy("joined", "desc")
      .get()
      .then((queryss) => {
        queryss.docChanges().forEach((querydoc) => {
          if (querydoc.doc.exists) {
            db.collection("classes")
              .doc(querydoc.doc.data().class)
              .get()
              .then((classdoc) => {
                if (classdoc.exists) {
                  db.collection("users")
                    .doc(classdoc.data().by)
                    .get()
                    .then((teacherdoc) => {
                      setClasses((prev) => {
                        return [
                          {
                            id: classdoc.id,
                            data: setDate(classdoc.data()),
                            creator: teacherdoc.data(),
                          },
                          ...prev,
                        ];
                      });
                    })
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          }
        });
        props.setLoading(false);
      });
  }

  function setDate(data) {
    return {
      ...data,
      created:
        data.created && data.created.toDate().toLocaleDateString("en-US"),
    };
  }

  function getRandomColorForLabel() {
    const index = Math.floor(Math.random() * 7);
    return colors[index];
  }

  function getRandomGradientForBackground() {
    const index = Math.floor(Math.random() * gradients.length);
    return gradients[index];
  }

  function getInputClassCode(event, data) {
    setInputClassCode(data.value);
  }

  function openClass(event, { id }) {
    props.setClassOpened(true);
    props.setLoading(true);
    props.setOpenedClassId(id);
  }

  function joinClass() {
    if (inputclasscode) {
      db.collection("classes")
        .doc(inputclasscode)
        .get()
        .then((doc) => {
          if (doc.exists) {
            db.collection("partof")
              .where("class", "==", inputclasscode)
              .where("student", "==", user.email)
              .get()
              .then((query) => {
                if (query.empty) {
                  db.collection("partof").add({
                    class: inputclasscode,
                    student: user.email,
                    joined:
                      firebase.default.firestore.FieldValue.serverTimestamp(),
                  });
                } else {
                  setErrMessage("You are already a part of this class");
                  setSeverity("info");
                  setSnackBarOpen(true);
                }
              });
          } else {
            setErrMessage("Class do not exist");
            setSeverity("error");
            setSnackBarOpen(true);
          }
        });
    } else {
      setErrMessage("Class code cannot be empty");
      setSeverity("error");
      setSnackBarOpen(true);
    }
    setInputClassCode("");
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <div className="studentclass__main">
      <div className="studentclass__heading">
        <h3>Classes</h3>
        <Divider section />
      </div>
      <div className="studentclass__classes">
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
            severity={severity}
          >
            {errmessage}
          </MuiAlert>
        </Snackbar>
        {props.loading ? (
          <Card.Group>
            {[1, 1, 1].map((elem,index) => (
              <Card key={index} className="loading__card">
                <Card.Content style={{ background: gradients[0] }}>
                  <Card.Header>
                    <Label color={getRandomColorForLabel()} size="medium">
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                      <Label.Detail>
                        <Placeholder>
                          <Placeholder.Line />
                        </Placeholder>
                      </Label.Detail>
                    </Label>
                  </Card.Header>
                </Card.Content>
                <Card.Content>
                  <Card.Meta>
                    <Placeholder>
                      <Placeholder.Line />
                    </Placeholder>
                  </Card.Meta>
                </Card.Content>
                <Card.Content>
                  <Card.Description>
                    <Placeholder>
                      <Placeholder.Line />
                    </Placeholder>
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        ) : (
          <Transition.Group as={CardGroup} duration={400} animation="pulse" centered={true}>
            <Card key="addnew">
              <Card.Content header="Join a class" />
              <Card.Content>
                <Input
                  focus
                  value={inputclasscode}
                  onChange={getInputClassCode}
                  placeholder="Class Code..."
                />
              </Card.Content>
              <Card.Content extra>
                <Button basic color="green" onClick={joinClass}>
                  <Icon name="add" />
                  Join Class
                </Button>
              </Card.Content>
            </Card>
            {classes.map((doc) => (
              <Card
                key={doc.id}
                className="classes__card"
                onClick={openClass}
                id={doc.id}
              >
                <Card.Content style={{ background: gradients[0] }}>
                  <Card.Header>
                    <Label
                      as="div"
                      color={getRandomColorForLabel()}
                      size="medium"
                      image
                    >
                      <img src={doc.creator.photoUrl} />
                      {doc.creator.username}
                      <Label.Detail>{doc.data.title}</Label.Detail>
                    </Label>
                  </Card.Header>
                </Card.Content>
                <Card.Content meta={"Created: " + `${doc.data.created}`} />
                <Card.Content description={doc.data.description} />
              </Card>
            ))}
          </Transition.Group>
        )}
      </div>
    </div>
  );
}
