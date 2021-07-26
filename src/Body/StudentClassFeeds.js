import React, { useEffect, useState } from "react";
import {
  Card,
  Transition,
  Header,
  Icon,
  Button,
  Modal,
  Label,
  Divider,
  Placeholder,
} from "semantic-ui-react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { db, auth, store } from "../firebase";
import PropTypes from "prop-types";
import StudentTests from "./StudentTests";
import ClassMates from "./ClassMates";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      className="tab__panel"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <div className="tabpanel">{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function StudentClassFeeds(props) {
  const [tests, setTests] = useState([]);
  const [classname, setClassName] = useState("");
  const [posts, setPosts] = useState([]);
  const [openedtab, setOpenedTab] = useState(0);
  const [leaveclassopen, setLeaveClassOpen] = useState(false);
  const user = auth.currentUser;
  const colors = ["black", "teal", "blue", "red", "olive", "green", "violet"];

  useEffect(() => {
    const unsubs_post = db
      .collection("posts")
      .where("class", "==", props.classid)
      .orderBy("created", "desc")
      .onSnapshot((querysnapshot) => {
        setPosts(
          querysnapshot.docs.map((doc) => ({
            id: doc.id,
            data: setDate(doc.data()),
          }))
        );
      });

    db.collection("classes")
      .doc(props.classid)
      .get()
      .then((doc) => {
        setClassName(doc.data().title);
        props.setLoading(false);
      });

    // const unsubs_test = db.collection('tests').where('class','==',props.classid).onSnapshot(snapshot=>{
    //   setTests(snapshot.docs.map(doc=>({id:doc.id,data:setDate(doc.data())})));
    // })

    const unsubs_test = db
      .collection("tests")
      .where("class", "==", props.classid)
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          db.collection("taken")
            .where("student", "==", auth.currentUser.email)
            .where("test", "==", doc.id)
            .get()
            .then((queryss) => {
              setTests((prev) => {
                return [
                  ...prev,
                  {
                    id: doc.id,
                    data: setDate(doc.data()),
                    taken: queryss.size === 0 ? false : true,
                    score:
                      queryss.size === 0 ? -1 : queryss.docs[0].data().score,
                  },
                ];
              });
            });
        });
      });

    return () => {
      unsubs_post();
      unsubs_test();
    };
  }, []);

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

  function changeTab(event, newTab) {
    setOpenedTab(newTab);
  }

  function goBack() {
    props.setOpenedClassId("");
    props.setLoading(true);
    props.setClassOpened(false);
  }

  function leaveClass() {
    db.collection("partof")
      .where("student", "==", user.email)
      .where("class", "==", props.classid)
      .get()
      .then((query) => {
        query.docs[0].ref
          .delete()
          .then(() => console.log("deleted"))
          .catch((err) => console.log(err));
      });
    setLeaveClassOpen(false);
    goBack();
  }

  return (
    <div className="tab__container">
      <div className="backbutton__container">
        <Button
          className="backbutton"
          basic
          color="grey"
          icon
          labelPosition="left"
          onClick={goBack}
        >
          <Icon name="arrow left" />
          Back
        </Button>

        <Label color="green" size="large">
          {classname}
          <Label.Detail>
            <Icon name="clipboard list" size="large" />
            {posts.length}
          </Label.Detail>
        </Label>

        <Modal
          basic
          onClose={() => setLeaveClassOpen(false)}
          onOpen={() => setLeaveClassOpen(true)}
          open={leaveclassopen}
          size="small"
          trigger={
            <Button className="leaveclassbutton" basic color="red">
              Leave Class
            </Button>
          }
        >
          <Header icon>
            <Icon name="sign-out" />
            Leave Class
          </Header>
          <Modal.Content>
            <p>Are you sure you want to leave this class?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              basic
              color="green"
              inverted
              onClick={() => setLeaveClassOpen(false)}
            >
              <Icon name="remove" /> No
            </Button>
            <Button color="red" inverted onClick={leaveClass}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
      <Divider className="section__divider" section />
      <div className="tab__main">
        <Tabs
          className="tabs"
          orientation="vertical"
          value={openedtab}
          onChange={changeTab}
        >
          <Tab label="Posts" id="tab_posts" />
          <Tab label="Tests" id="tab_tests" />
          <Tab label="Classmates" id="tab_students" />
        </Tabs>
        <TabPanel value={openedtab} index={0}>
          {props.loading ? (
            <Card.Group centered>
              {[1, 1].map((elem, index) => (
                <Card key={index}>
                  <Card.Content
                    style={{
                      background: "linear-gradient(to right, #232526, #414345)",
                    }}
                  >
                    <Card.Header>
                      <Label
                        as="a"
                        color={getRandomColorForLabel()}
                        size="large"
                      >
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
              ))}
            </Card.Group>
          ) : (
            <Transition.Group
              as={Card.Group}
              duration={400}
              animation="pulse"
              className="cardsgroup"
              centered={true}
            >
              {posts.map((post, index) => (
                <Card key={post.id} id={post.id}>
                  <Card.Content
                    style={{
                      background: "linear-gradient(to right, #232526, #414345)",
                    }}
                  >
                    <Card.Header>
                      <Label
                        as="a"
                        color={getRandomColorForLabel()}
                        size="large"
                      >
                        {post.data.title}
                      </Label>
                    </Card.Header>
                  </Card.Content>
                  <Card.Content meta={post.data.created} />
                  <Card.Content description={post.data.description} />
                  {post.data.fileurl ? (
                    <Card.Content extra>
                      <a
                        style={{ margin: "0 20% 0 0" }}
                        classname="postfile__download"
                        href={post.data.fileurl}
                      >
                        <Icon name="download" color="green" size="large" />
                        {post.data.filename}
                      </a>
                    </Card.Content>
                  ) : (
                    ""
                  )}
                </Card>
              ))}
            </Transition.Group>
          )}
        </TabPanel>
        <TabPanel value={openedtab} index={1}>
          <StudentTests
            setTestId={props.setTestId}
            setTestStarted={props.setTestStarted}
            tests={tests}
          />
        </TabPanel>
        <TabPanel value={openedtab} index={2}>
          <ClassMates classid={props.classid} />
        </TabPanel>
      </div>
    </div>
  );
}
