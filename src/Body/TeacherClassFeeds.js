import React,{useEffect, useState} from 'react';
import TeacherTests from './TeacherTests'
import PropTypes from 'prop-types';
import {useTheme} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {store, db,auth} from '../firebase'
import AddIcon from '@material-ui/icons/Add'
import Input from '@material-ui/core/Input'
import {Dialog,DialogContent,DialogTitle} from '@material-ui/core'
import * as firebase from 'firebase';
import {TextField} from '@material-ui/core'
import MuiButton from '@material-ui/core/Button'
import {Card,Icon,Button,Header,Modal,Divider,Transition,Label,Placeholder} from 'semantic-ui-react/'
import 'semantic-ui-css/semantic.min.css'
import './TeacherClassFeeds.css'
import ClassMates from './ClassMates';


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
        {value === index && (
            <div className="tabpanel">{children}</div>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

function TeacherClassFeeds(props)
{
  const [posts,setPosts] = useState([]);
  const [tests,setTests] = useState([]);
  const [addpostopen,setAddPostOpen] = useState(false);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [file,setFile] = useState(null);
  const [openedtab,setOpenedTab] = useState(0);
  const [deleteclassopen,setDeleteClassOpen] = useState(false);
  const [copied,setCopied]= useState(false);
  const [classname,setClassName]= useState('');
  const [loading,setLoading]=useState(true)
  const colors=['black','teal','blue','red','olive','green','violet']


  useEffect(()=>{
    const unsubscribe = db.collection('posts').where('class','==',props.classid).orderBy('created','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,data: setDate(doc.data())})));
    })

    db.collection('classes').doc(props.classid).get().then(doc=>{
      setClassName(doc.data().title);
      props.setLoading(false)
      setLoading(false)
    }).catch(err=>console.log(err))

    const unsubscribe_test = db.collection('tests').where('class','==',props.classid).orderBy('created',"desc").onSnapshot(snapshot=>{
      setTests(snapshot.docs.map(doc=>({id:doc.id,data:setDate(doc.data())})))
    })



    return ()=>{
      unsubscribe();
      unsubscribe_test()
    }
  },[]);

    function setDate(data){
      return {
          ...data,
          created : data.created&&data.created.toDate().toLocaleDateString("en-US")
      }
  }

  function getRandomColorForLabel(){
    const index = Math.floor(Math.random()*7)
    return colors[index]
}

    function changeTab(event,newTab)
    {
        setOpenedTab(newTab)
    }

    function createPost()
    {
      setAddPostOpen(true);
    }

    function closeAddPost()
    {
      setAddPostOpen(false);
    }

    function goBack(){
      props.setOpenedClassId("");
      props.setLoading(true);
      props.setClassOpened(false);
    }

    function submitPost(){
      if(file){
        const uploadTask = store.ref(`files/${file.name}`).put(file);
        uploadTask.on("state_changed",(snapshot)=>{},(err)=>{console.log(err)},()=>{
          store.ref('files').child(file.name).getDownloadURL()
          .then((url)=>{
            db.collection('posts').add({
              class: props.classid,
              created : firebase.default.firestore.FieldValue.serverTimestamp(),
              title:title,
              description:description,
              fileurl:url,
              filename:file.name
            }).catch(err=>{console.log(err)})
            }).catch(err=>{console.log(err)})
          })
        }
      else{
        db.collection('posts').add({
          class: props.classid,
          created : firebase.default.firestore.FieldValue.serverTimestamp(),
          title:title,
          description:description,
          fileurl: null,
        }).catch(err=>{console.log(err)})
      }
      setAddPostOpen(false);
    }

    function removePost(event){
      return db.collection('posts').doc(event.target.id).delete();
    }

    function removeClass(){
      db.collection('posts').where('class','==',props.classid).get()
      .then((snapshot=>{
        snapshot.forEach(doc=>{
          doc.ref.delete();
        })
      })).catch(err=>{console.log(err)});

      setDeleteClassOpen(false);

      db.collection('tests').where('class','==',props.classid).get()
      .then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
          db.collection('questions').doc(doc.data().questions).delete();
          db.collection('correctans').where('test','==',doc.id).get()
          .then(snaps=>{
            snaps.docs.forEach(snap=>{
              snap.ref.delete();
            })
          })
          doc.ref.delete();
        })
      })

      db.collection('classes').doc(props.classid).delete();
      db.collection('partof').where('class','==',props.classid).get().then(docs=>{
        docs.forEach(doc=>{
          doc.ref.delete();
        })
      })
      goBack();
    }

    function copyCode(){
      navigator.clipboard.writeText(props.classid);
      setCopied(true);
      setTimeout(()=>{setCopied(false)},2000);
    }

    return(
        <div className="tab__container">
          <div className="backbutton__container">
                <Button className="backbutton" basic color="grey" icon labelPosition='left' onClick={goBack}>
                  <Icon name='arrow left' />
                   Back
               </Button>
               <div className="class__label">
               <Label as='div' color='green' size='large'>{classname}</Label>
               <Button className="copybutton" basic color="green" icon labelPosition='left' onClick={copyCode}>
                  <Icon name={!copied?'copy outline':'exclamation'} />
                   {!copied?'Copy Code':'Copied'}
               </Button>
               </div>
                 

              <Modal
              basic
              onClose={() => setDeleteClassOpen(false)}
              onOpen={() => setDeleteClassOpen(true)}
              open={deleteclassopen}
              size='small'
              trigger={<Button className="removeclassbutton" basic color="red">Delete Class</Button>}
            >
              <Header icon>
                <Icon name='delete' />
                Delete Class
              </Header>
              <Modal.Content>
                <p>
                  Are you sure you want to delete this class permanently?
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color='green' inverted onClick={() => setDeleteClassOpen(false)}>
                  <Icon name='remove' /> No
                </Button>
                <Button color='red' inverted onClick={removeClass}>
                  <Icon name='checkmark' /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
          <Divider className="section__divider" section/>
          <div className="tab__main">
          <Tabs
            className="tabs"
            orientation="vertical"
            value={openedtab}
            onChange={changeTab}>
            <Tab label="Posts" id="tab_posts"/>
            <Tab label="Tests" id="tab_tests"/>
            <Tab label="Students" id="tab_students"/>
        </Tabs>
        <TabPanel value={openedtab} index ={0}>
        {props.loading?<Card.Group centered>{[1,1,1].map((elem,index)=>(<Card key={index}>
                <Card.Content style={{background:'linear-gradient(to right, #232526, #414345)'}}><Card.Header><Label as='a' color={getRandomColorForLabel()} size='large'><Placeholder><Placeholder.Line/></Placeholder></Label></Card.Header></Card.Content>
                <Card.Content><Card.Meta></Card.Meta></Card.Content>
                <Card.Content><Card.Description><Placeholder><Placeholder.Line/></Placeholder></Card.Description></Card.Content>
                <Card.Content extra><Placeholder><Placeholder.Line/></Placeholder></Card.Content>
              </Card>))}</Card.Group>:
        <Transition.Group
          as={Card.Group}
          duration={400}
          animation ='pulse'
          className='cardsgroup'
          centered = {true}
        >
                <Card>
                  <Card.Content header="Add a Post"/>
                  <Card.Content>
                    <Card.Description><div className="addpostbutton" onClick={createPost}><AddIcon fontSize="large"/></div></Card.Description>
                  </Card.Content>
                </Card>
                {posts.map((post,index)=>(
                <Card key={post.id} id={post.id}>
                  <Card.Content style={{background:'linear-gradient(to right, #232526, #414345)'}}><Card.Header><Label as='a' color={getRandomColorForLabel()} size='large'>{post.data.title}</Label></Card.Header></Card.Content>
                  <Card.Content meta={post.data.created}/>
                  <Card.Content description={post.data.description}/>
                    <Card.Content extra>
                      {post.data.fileurl?
                    <a style={{margin:'0 20% 0 0'}} classname="postfile__download" href={post.data.fileurl}><Icon name='download' color='green' size='large'/>{post.data.filename}</a>:""}
                    <Icon name="remove" color="orange" size="large" className="removepostbutton" onClick={removePost} id={post.id}/>Remove
                    </Card.Content>
                </Card>
              ))
              }</Transition.Group>}
          </TabPanel>


        <TabPanel value={openedtab} index ={1}><TeacherTests classid={props.classid} tests={tests} loading={loading}/></TabPanel>


        <TabPanel value={openedtab} index ={2}><ClassMates classid={props.classid}/></TabPanel>


        <div className='addpost__form'>
            <Dialog open={addpostopen} onClose={closeAddPost} aria-labelledby="form-dialog-title">
                <DialogTitle>Add New Post</DialogTitle>
                <DialogContent>
                    <div className="addpost__title">
                       <TextField required type="text" value={title} label="Title" defaultValue="" onInput={(e)=>{setTitle(e.target.value)}}/>
                    </div>
                    <div className="addpost__file">
                       <Input type="file" label="File" onChange={(e)=>{setFile(e.target.files[0])}}/>
                    </div>
                    <div className="addpost__description">
                       <TextField fullWidth type="text" name="desc" value={description} label="Description" onInput={(e)=>{setDescription(e.target.value)}} />
                    </div>
                    <div className="addpost__submit">
                       <div className="addpost__button">
                       <MuiButton variant = "outlined"
                       color = "primary"
                       onClick={submitPost}>Submit</MuiButton>
                       </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        </div>
        </div>
    );
}
export default TeacherClassFeeds;