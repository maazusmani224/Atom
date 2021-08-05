import React, { useState, useEffect } from "react";
import {
  Message,
  Divider,
  Radio,
  Button,
  Grid,
  Segment,
  Icon,
  Modal,
} from "semantic-ui-react";
import { db, auth } from "../firebase";
import * as firebase from "firebase";
import "./Test.css";

export default function Test(props) {
  const [message, setMessage] = useState(
    "Submitting your response. Do not close."
  );
  const [testcomplete, setTestComplete] = useState(false);
  const [timeoutid, setTimeOutId] = useState(0);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState([{}]);
  const [docref, setDocRef] = useState("");
  const [showques, setShowQues] = useState(false);

  useEffect(() => {
    window.addEventListener("blur", handleVisibilityChange, false);
    window.addEventListener("focus", handleVisibilityChange, false);

    db.collection("tests")
      .doc(props.testid)
      .get()
      .then((test) => {
        if (test.data().active) {
          db.collection("questions")
            .doc(test.data().questions)
            .get()
            .then((questions) => {
              setQuestions(questions.data().questions);
            })
            .catch((err) => console.log(err));
        } else {
          setMessage(
            "Test was ended by the teacher. Your responses were recorded"
          );
          submitTest();
        }
      })
      .catch((err) => console.log(err));

    return () => {
      window.removeEventListener("blur", handleVisibilityChange, false);
      window.removeEventListener("focus", handleVisibilityChange, false);
    };
  });

  useEffect(() => {
    document.getElementById(index).classList.add("active");
  }, [index]);

  useEffect(() => {
    db.collection("taken")
      .where("student", "==", auth.currentUser.email)
      .where("test", "==", props.testid)
      .get()
      .then((queryss) => {
        if (queryss.size > 0) setTestComplete(true);
        else {
          db.collection("taken")
            .add({
              test: props.testid,
              student: auth.currentUser.email,
              time: firebase.default.firestore.FieldValue.serverTimestamp(),
              score: -1,
              response: {},
            })
            .then((doc) => {
              setDocRef(doc.id);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [testcomplete]);

  function next() {
    if (index < questions.length - 1) {
      document.getElementById(index).classList.remove("active");
      setIndex(index + Number(1));
    }
  }

  function prev() {
    if (index > 0) {
      document.getElementById(index).classList.remove("active");
      setIndex(index - Number(1));
    }
  }

  function goToQues(event) {
    const ques = Number(event.target.attributes.getNamedItem("index").value);
    document.getElementById(index).classList.remove("active");
    setIndex(ques);
  }

  function changeResponse(e, { value }) {
    document.getElementById(index).classList.add("answered");
    setResponse((prev) => {
      return { ...prev, [index]: value };
    });
  }

  function submitTest() {
    db.collection("taken")
      .doc(docref)
      .update({
        response: response,
      })
      .then(() => {
        setTestComplete(true);
        calcScore();
      })
      .catch((err) => console.log(err));
    window.removeEventListener("blur", handleVisibilityChange, false);
    window.removeEventListener("focus", handleVisibilityChange, false);
  }

  window.onbeforeunload = () => {
    return "Your exam will be submitted automatically";
  };

  function calcScore() {
    db.collection("correctans")
      .where("test", "==", props.testid)
      .get()
      .then((queryss) => {
        if (queryss.docs[0].exists) {
          const ans = queryss.docs[0].data().ans;
          const points = queryss.docs[0].data().points;
          var score = 0;
          ans.forEach((a, i) => {
            if (response[i] != null) {
              if (response[i] == a) score = score + Number(points[i]);
            }
          });
          db.collection("taken")
            .doc(docref)
            .update({
              score: score,
            })
            .then(() => {
              setMessage(
                "Your responses are recorded. Thank you for taking this test!"
              );
            });
        }
      });
  }

  function handleVisibilityChange(e) {
    let timeoutId;
    if (e.type === "blur") {
      console.log("hidden");
      timeoutId = setTimeout(() => {
        setMessage(
          "Your window was inactive for more than 10 seconds. Your Test is submitted automatically."
        );
        submitTest();
      }, 10000);
      setTimeOutId(timeoutId);
    } else {
      clearTimeout(timeoutid);
      console.log("Active");
    }
  }

  return !testcomplete ? (
    <Grid className="grid__main" columns={2} divided>
      <Grid.Row className="testmain">
        <Grid.Column width={4}>
          <div style={{ margin: "1%", overflow:"scroll"}}>
            <Grid doubling columns={4}>
              {questions.map((ques, i) => (
                <Grid.Column key={i}>
                  <div
                    id={i}
                    index={i}
                    onClick={goToQues}
                    className="indices"
                  >
                    {i + 1}
                  </div>
                </Grid.Column>
              ))}
            </Grid>
          </div>
          <Button color="blue" onClick={submitTest}>
            Submit
          </Button>
        </Grid.Column>
        <Grid.Column width={12}>
          <div style={{ margin: "1%", fontSize: "1.25rem", overflowX:"scroll"}}>
            <div
              style={{ fontSize: "1.5rem", display: "flex" }}
              className="question ques_desc"
            >
              <div style={{ marginRight: "1%" }}>
                {Number(index) + Number(1) + "."}
              </div>
              {questions[index].ques}
            </div>
            <Divider />
            {questions[index].optiona && (
              <div className="question">
                <Radio
                  value={0}
                  onChange={changeResponse}
                  checked={response[index] === 0}
                />
                {questions[index].optiona}
              </div>
            )}
            {questions[index].optionb && (
              <div className="question">
                <Radio
                  value={1}
                  onChange={changeResponse}
                  checked={response[index] === 1}
                />
                {questions[index].optionb}
              </div>
            )}
            {questions[index].optionc && (
              <div className="question">
                <Radio
                  value={2}
                  onChange={changeResponse}
                  checked={response[index] === 2}
                />
                {questions[index].optionc}
              </div>
            )}
            {questions[index].optiond && (
              <div className="question">
                <Radio
                  value={3}
                  onChange={changeResponse}
                  checked={response[index] === 3}
                />
                {questions[index].optiond}
              </div>
            )}
          </div>
          <Button disabled={index <= 0} basic color="green" onClick={prev}>
            <Icon name="arrow circle left" />
            Prev
          </Button>
          <Button
            disabled={index >= questions.length - 1}
            basic
            color="green"
            onClick={next}
          >
            Next
            <Icon name="arrow circle right" />
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : (
    <div>
      <Segment style={{ margin: "1%", fontSize: "1.25rem" }}>
        {message}
        <Divider />
        <Button
          basic
          color="orange"
          onClick={() => {
            setShowQues(true);
          }}
        >
          Show Questions
        </Button>
        <Button
          basic
          color="blue"
          onClick={() => {
            props.setTestStarted(false);
          }}
        >
          <Icon name="check circle outline" />
          Done
        </Button>
      </Segment>

      <Modal
        basic
        onClose={() => {
          setShowQues(false);
        }}
        open={showques}
      >
        <div className="display__test">
          {questions.map((ques, index) => (
            <Message key={index}>
              <Message.Content>
                <div>
                  <Message.Header>
                    {index + 1 + "  "}
                    {ques.ques}
                  </Message.Header>
                  {ques.optiona && <div>{ques.optiona}</div>}
                  {ques.optionb && <div>{ques.optionb}</div>}
                  {ques.optionc && <div>{ques.optionc}</div>}
                  {ques.optiond && <div>{ques.optiond}</div>}
                </div>
              </Message.Content>
              <Divider />
            </Message>
          ))}
        </div>
      </Modal>
    </div>
  );
}
