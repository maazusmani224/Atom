import React,{useState,useEffect} from 'react'
import TypoGraphy from '@material-ui/core/Typography'
import { Card,Icon,Divider,Transition,CardGroup,Label,Placeholder } from 'semantic-ui-react'
import {Dialog,DialogTitle,DialogContent,TextField,Button} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {db,auth} from '../firebase'
import * as firebase from 'firebase'
import 'semantic-ui-css/semantic.min.css'
import './TeacherClass.css'

export default function TeacherClass(props){
    const [openaddclass,setOpenAddClass] = useState(false);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [classes,setClasses] = useState([]);
    const colors=['black','teal','blue','red','olive','green','violet']

    useEffect(()=>{
       const unsubscribe = db.collection('classes').where('by','==',auth.currentUser.email).orderBy('created','desc').onSnapshot(snapshot=>{
            setClasses(snapshot.docs.map(doc=>({id:doc.id, data: setDate(doc.data())})))
            props.setLoading(false)
        });


        return ()=>{
            props.setLoading(true)
            unsubscribe();
        }
    },[])

    function getRandomColorForLabel(){
        const index = Math.floor(Math.random()*7)
        return colors[index]
    }

    function openAddClassForm(){
        setOpenAddClass(true);
    }

    function setDate(data){
        return {
            ...data,
            created : data.created&&data.created.toDate().toLocaleDateString("en-US")
        }
    }

    function closeAddClassForm(){
        setOpenAddClass(false);
    }

    function createClass(){
        db.collection('classes').add({
            by: auth.currentUser.email,
            creator: db.collection('users').doc(auth.currentUser.email),
            created: firebase.default.firestore.FieldValue.serverTimestamp(),
            title: title,
            description: description,
            students:[]
        }).catch(err=>{alert(err)});
        setOpenAddClass(false);
        setTitle("");
        setDescription("");
    }

    function openClass(event,{id}){
        props.setOpenedClassId(id);
        props.setClassOpened(true);
    }

    return (
        <div className="teacherclass__main">
            <div className="teacherclass__heading">
                <h3>Classes</h3>
                <Divider section/>
            </div>
            <div className="teacherclass__classes">
            {props.loading?<Card.Group centered>{[1,1,1].map((elem,index)=>(<Card key={index}>
                        <Card.Content style={{background:'linear-gradient(to right, #232526, #414345)'}}><Card.Header><Label as='a' color={getRandomColorForLabel()} size='large'><Placeholder><Placeholder.Line/></Placeholder></Label></Card.Header></Card.Content>
                        <Card.Content><Card.Meta></Card.Meta></Card.Content>
                        <Card.Content><Card.Description><Placeholder><Placeholder.Line/></Placeholder></Card.Description></Card.Content>
                        <Card.Content extra><Placeholder><Placeholder.Line/></Placeholder></Card.Content>
                      </Card>))}</Card.Group>:
            <Transition.Group
             as={CardGroup}
             duration={400}
             animation ='pulse'
             size='huge'
             >
                    <Card key="addnew">
                      <Card.Content header="Create New Class"/>
                      <Card.Content><span className="addclass__button" onClick={openAddClassForm}><AddIcon fontSize="large"/></span></Card.Content>
                    </Card>
                    {classes.map(doc=>(
                        <Card key={doc.id} className="classes__card" onClick={openClass} id={doc.id}>
                            <Card.Content style={{background:'linear-gradient(to right, #232526, #414345)'}}><Card.Header><Label as='a' color={getRandomColorForLabel()} size='large'>{doc.data.title}</Label></Card.Header></Card.Content>
                            <Card.Content meta={doc.data.created}/>
                            <Card.Content description={doc.data.description}/>
                        </Card>
                    ))
                    }
                </Transition.Group>}
            </div>

            <div className="teacherclass__addclassform">
              <Dialog open={openaddclass} onClose={closeAddClassForm} aria-labelledby="form-dialog-addclass">
                  <DialogTitle>Create Class</DialogTitle>
                  <DialogContent>
                      <div className="addclass__title">
                         <TextField required type="text" value={title} label="Title" defaultValue="" onInput={(e)=>{setTitle(e.target.value)}}/>
                      </div>
                      <div className="addclass__description">
                         <TextField fullWidth type="text" name="desc" value={description} label="Description" onInput={(e)=>{setDescription(e.target.value)}} />
                      </div>
                      <div className="addclass__submit">
                         <div className="addclass__button">
                         <Button variant = "outlined"
                         color = "primary"
                         onClick={createClass}>Create</Button>
                         </div>
                      </div>
                  </DialogContent>
              </Dialog>
            </div>
        </div>
    );
}