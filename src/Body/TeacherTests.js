import React, { useState} from "react";
import { db} from "../firebase";
import * as firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
  Transition,
  Card,
  Placeholder,
  Icon,
  Label,
  Button,
  Segment,
  Input,
  Radio,
  TextArea,
  Modal,
  Divider,
  Message,
  Image,
  List,
} from "semantic-ui-react";
import "./TeacherTests.css";

function Question(props) {
  function deleteQues() {
    props.setQuestions((prev) => {
      return prev.filter((ques, index) => {
        return index !== props.index;
      });
    });
    props.setCorrectAns((prev) => {
      return prev.filter((ans, index) => {
        return index !== props.index;
      });
    });

    props.setPoints((prev) => {
      return prev.filter((ans, index) => {
        return index !== props.index;
      });
    });
  }

  return (
    <div className="question">
      <Message>
        <div className="question__text">
          <Message.Header>
            {props.index + 1 + ".    "}
            {props.question.ques}
          </Message.Header>
        </div>
        {props.question.optiona && (
          <div>
            <p style={{ color: props.correctans === 0 && "green" }}>
              {props.question.optiona}
            </p>
          </div>
        )}
        {props.question.optionb && (
          <div>
            <p style={{ color: props.correctans === 1 && "green" }}>
              {props.question.optionb}
            </p>
          </div>
        )}
        {props.question.optionc && (
          <div>
            <p style={{ color: props.correctans === 2 && "green" }}>
              {props.question.optionc}
            </p>
          </div>
        )}
        {props.question.optiond && (
          <div>
            <p style={{ color: props.correctans === 3 && "green" }}>
              {props.question.optiond}
            </p>
          </div>
        )}
        {props.question.points && (
          <div>
            <p>Points: {props.question.points}</p>
          </div>
        )}
        <div>
          <Button basic color="red" onClick={deleteQues}>
            <Icon name="delete" />
            Delete
          </Button>
        </div>
      </Message>
      <Divider />
    </div>
  );
}

export default function TeacherTests(props) {
  const [errmessage, setErrMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [listopen, setListOpen] = useState(false);
  const [snackbaropen, setSnackBarOpen] = useState(false);
  const [createtestformopen, setCreateTestFormOpen] = useState(false);
  const [openedtestquestions, setOpenedTestQuestions] = useState([]);
  const [openedtestans, setOpenedTestAns] = useState([]);
  const [title, setTitle] = useState("");
  const [currentques, setCurrentQues] = useState({ points: 5 });
  const [questions, setQuestions] = useState([]);
  const [correctans, setCorrectAns] = useState([]);
  const [points, setPoints] = useState([]);
  const [currentcorrectans, setCurrentCorrectAns] = useState(-1);
  const [addques, setAddQues] = useState(false);
  const [testopen, setTestOpen] = useState(false);

  function openCreateTestForm() {
    setCreateTestFormOpen(true);
  }

  function addquestion() {
    setCurrentQues({ points: 5 });
    setCurrentCorrectAns(-1);
    setAddQues(true);
  }

  function saveCurrentQues() {
    if (currentcorrectans !== -1) {
      setQuestions((prev) => {
        return [...prev, currentques];
      });
      setCorrectAns((prev) => {
        return [...prev, currentcorrectans];
      });
      setPoints((prev) => {
        return [...prev, Number(currentques.points)];
      });
      setCurrentCorrectAns(-1);
      setCurrentQues({ points: 5 });
      setAddQues(false);
    } else {
      setErrMessage("Choose a correct answer for this question");
      setSnackBarOpen(true);
    }
  }

  function closeCreateTestForm() {
    setCreateTestFormOpen(false);
  }

  function resetTest() {
    setCurrentQues({ points: 5 });
    setCurrentCorrectAns(-1);
    setAddQues(false);
    setQuestions([]);
    setCorrectAns([]);
    setTitle("");
  }

  function saveTest() {
    if (!addques) {
      var total = 0;
      questions.forEach((ques) => {
        total = total + Number(ques.points);
      });
      db.collection("questions")
        .add({
          questions: questions,
        })
        .then((quessnapshot) => {
          db.collection("tests")
            .add({
              class: props.classid,
              title: title,
              questions: quessnapshot.id,
              created: firebase.default.firestore.FieldValue.serverTimestamp(),
              marks: total,
              active: false,
            })
            .then((snapshot) => {
              db.collection("correctans").add({
                test: snapshot.id,
                ans: correctans,
                points: points,
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
      setCreateTestFormOpen(false);
      setCurrentQues({ points: 5 });
      setCurrentCorrectAns(-1);
      setAddQues(false);
      setQuestions([]);
      setCorrectAns([]);
      setTitle("");
    } else {
      setErrMessage("There are unsaved questions");
      setSnackBarOpen(true);
    }
  }

  function changeTestStatus(id, active) {
    db.collection("tests")
      .doc(id)
      .get()
      .then((snapshot) => {
        var active = snapshot.data().active;
        db.collection("tests")
          .doc(id)
          .update({ active: !active })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  function openTest(event, { index }) {
    db.collection("questions")
      .doc(props.tests[index].data.questions)
      .get()
      .then((quessnapshot) => {
        setOpenedTestQuestions(quessnapshot.data().questions);

        db.collection("correctans")
          .where("test", "==", props.tests[index].id)
          .get()
          .then((anssnapshot) => {
            setOpenedTestAns(anssnapshot.docs[0].data().ans);
            setTestOpen(true);
          })
          .catch((error) => console.log(error));
      })
      .catch((err) => console.log(err.message));
  }

  function deleteTest(event) {
    const index = event.target.attributes.getNamedItem("index").value;
    console.log(index);

    db.collection("correctans")
      .where("test", "==", props.tests[index].id)
      .get()
      .then((snapshot) => {
        snapshot.docs[0].ref.delete();
      })
      .catch((err) => console.log(err));

    db.collection("questions").doc(props.tests[index].data.questions).delete();

    db.collection("tests").doc(props.tests[index].id).delete();

    db.collection("taken")
      .where("test", "==", props.tests[index].id)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  function toggleStudentList(e, data) {
    if (!listopen) {
      var unsubs = db
        .collection("taken")
        .where("test", "==", data.tid)
        .get()
        .then((snapss) => {
          snapss.docs.forEach((doc) => {
            if (doc.exists) {
              db.collection("users")
                .doc(doc.data().student)
                .get()
                .then((student) => {
                  setStudents((prev) => {
                    return [
                      {
                        username: student.data().username,
                        score: doc.data().score,
                        photoUrl: student.data().photoUrl,
                        email: student.id,
                      },
                      ...prev,
                    ];
                  });
                });
            }
          });
        });
      setListOpen(true);
    }
  }

  return (
    <div className="tests__tab">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbaropen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
      >
        <MuiAlert
          elevation={5}
          variant="filled"
          onClose={handleSnackBarClose}
          severity="warning"
        >
          {errmessage}
        </MuiAlert>
      </Snackbar>
      {props.loading ? (
        [1, 1, 1].map((elem) => (
          <Card>
            <Card.Content
              style={{
                background: "linear-gradient(to right, #232526, #414345)",
              }}
            >
              <Card.Header>
                <Label as="a" color="blue" size="large">
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                </Label>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Card.Meta></Card.Meta>
            </Card.Content>
            <Card.Content>
              <Card.Description>
                <Placeholder>
                  <Placeholder.Line />
                </Placeholder>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Transition.Group
          as={Card.Group}
          duration={400}
          animation="pulse"
          className="cardsgroup"
          centered={true}
        >
          <Card key="addnew">
            <Card.Content header="Create New Test" />
            <Card.Content>
              <span className="addtest__button" onClick={openCreateTestForm}>
                <Icon name="add" size="big" />
              </span>
            </Card.Content>
          </Card>
          {props.tests.map((doc, index) => (
            <Card key={doc.id} className="test__card" id={doc.id}>
              <Card.Content
                style={{
                  background: "linear-gradient(to right, #232526, #414345)",
                }}
              >
                <Card.Header>
                  <Label
                    as="a"
                    index={index}
                    onClick={openTest}
                    color="blue"
                    size="large"
                  >
                    {doc.data.title}
                  </Label>
                  <Label
                    as="a"
                    tid={doc.id}
                    onClick={toggleStudentList}
                    color="green"
                    size="large"
                  >
                    <Icon fitted name="user circle" />
                  </Label>
                </Card.Header>
              </Card.Content>
              <Card.Content meta={doc.data.created} />
              <Card.Content>
                <Card.Description>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Max Marks:{doc.data.marks}</div>{" "}
                    <Radio
                      checked={doc.data.active}
                      slider
                      label="Enabled"
                      onChange={() => changeTestStatus(doc.id, doc.active)}
                    />
                    <div
                      style={{ cursor: "pointer" }}
                      index={index}
                      onClick={deleteTest}
                    >
                      <Icon index={index} name="cancel" color="red" />
                    </div>
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Transition.Group>
      )}

      <Modal basic open={createtestformopen}>
        <Segment className="create__test__form">
          <div className="create__test__form__data">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e, { value }) => setTitle(value)}
            />
            {questions.map((ques, index) => (
              <Question
                key={index}
                question={ques}
                correctans={correctans[index]}
                index={index}
                setQuestions={setQuestions}
                setCorrectAns={setCorrectAns}
                setPoints={setPoints}
              />
            ))}
            {addques && (
              <div
                className="add__newques"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <TextArea
                  className="add__newques__elem"
                  placeholder="Question"
                  rows={2}
                  value={currentques.ques}
                  onChange={(e, { value }) => {
                    setCurrentQues((prev) => {
                      return { ...prev, ques: value };
                    });
                  }}
                ></TextArea>
                <div className="add__newques__elem">
                  <Radio
                    value={0}
                    onChange={() => {
                      setCurrentCorrectAns(0);
                    }}
                    checked={currentcorrectans === 0}
                  />
                  <Input
                    type="text"
                    placeholder="Option 1"
                    value={currentques.optiona}
                    onChange={(e, { value }) =>
                      setCurrentQues((prev) => {
                        return { ...prev, optiona: value };
                      })
                    }
                  />
                </div>
                <div className="add__newques__elem">
                  <Radio
                    value={1}
                    onChange={() => {
                      setCurrentCorrectAns(1);
                    }}
                    checked={currentcorrectans === 1}
                  />
                  <Input
                    type="text"
                    placeholder="Option 2"
                    value={currentques.optionb}
                    onChange={(e, { value }) =>
                      setCurrentQues((prev) => {
                        return { ...prev, optionb: value };
                      })
                    }
                  />
                </div>
                <div className="add__newques__elem">
                  <Radio
                    value={2}
                    onChange={() => {
                      setCurrentCorrectAns(2);
                    }}
                    checked={currentcorrectans === 2}
                  />
                  <Input
                    type="text"
                    placeholder="Option 3"
                    value={currentques.optionc}
                    onChange={(e, { value }) =>
                      setCurrentQues((prev) => {
                        return { ...prev, optionc: value };
                      })
                    }
                  />
                </div>
                <div className="add__newques__elem">
                  <Radio
                    value={3}
                    onChange={() => {
                      setCurrentCorrectAns(3);
                    }}
                    checked={currentcorrectans === 3}
                  />
                  <Input
                    type="text"
                    placeholder="Option 4"
                    value={currentques.optiond}
                    onChange={(e, { value }) =>
                      setCurrentQues((prev) => {
                        return { ...prev, optiond: value };
                      })
                    }
                  />
                </div>
                <div className="add__newques__elem">
                  <Input
                    type="text"
                    label="Points"
                    defaultValue={5}
                    value={currentques.points}
                    onChange={(e, { value }) =>
                      setCurrentQues((prev) => {
                        return { ...prev, points: value };
                      })
                    }
                  />
                </div>
                <div className="add__newques__elem">
                  <Button color="green" onClick={saveCurrentQues}>
                    Save Question
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Divider />
          <Button basic color="teal" onClick={addquestion}>
            <Icon name="add" />
            Add New Question
          </Button>
          <Button basic color="green" onClick={saveTest}>
            <Icon name="save" />
            Create Test
          </Button>
          <Button basic color="orange" onClick={resetTest}>
            <Icon name="recycle" />
            Reset
          </Button>
          <Button basic color="red" onClick={closeCreateTestForm}>
            <Icon name="cancel" />
            Close
          </Button>
        </Segment>
      </Modal>

      <Modal
        basic
        onClose={() => {
          setTestOpen(false);
          setOpenedTestQuestions([]);
        }}
        open={testopen}
      >
        <div className="display__test">
          {testopen &&
            openedtestquestions.map((ques, index) => (
              <Message key={index}>
                <Message.Content>
                  <div>
                    <Message.Header>
                      {index + 1 + "  "}
                      {ques.ques}
                    </Message.Header>
                    {ques.optiona && (
                      <div>
                        <p
                          style={{
                            color: openedtestans[index] === 0 && "green",
                          }}
                        >
                          {ques.optiona}
                        </p>
                      </div>
                    )}
                    {ques.optionb && (
                      <div>
                        <p
                          style={{
                            color: openedtestans[index] === 1 && "green",
                          }}
                        >
                          {ques.optionb}
                        </p>
                      </div>
                    )}
                    {ques.optionc && (
                      <div>
                        <p
                          style={{
                            color: openedtestans[index] === 2 && "green",
                          }}
                        >
                          {ques.optionc}
                        </p>
                      </div>
                    )}
                    {ques.optiond && (
                      <div>
                        <p
                          style={{
                            color: openedtestans[index] === 3 && "green",
                          }}
                        >
                          {ques.optiond}
                        </p>
                      </div>
                    )}
                  </div>
                </Message.Content>
                <Divider />
              </Message>
            ))}
        </div>
      </Modal>

      <Modal
        basic
        onClose={() => {
          setListOpen(false);
          setStudents([]);
        }}
        open={listopen}
      >
        <div className="display__test">
          <Message>
            <Message.Content>
              <div>
                <Message.Header>{}</Message.Header>
                <List divided verticalAlign="middle">
                  <List.Item>
                    <List.Content>
                      <List.Header as="div">
                        Total Students: {students.length}
                      </List.Header>
                    </List.Content>
                  </List.Item>
                  {students.map((student) => (
                    <List.Item key={student.email}>
                      <Image avatar src={student.photoUrl} />
                      <List.Content>
                        <List.Header as="a">{student.username}</List.Header>
                        <List.Description>
                          Score: {student.score}{" "}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </div>
            </Message.Content>
          </Message>
        </div>
      </Modal>
    </div>
  );
}
