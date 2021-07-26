import React,{useEffect,useState} from 'react';
import {auth,db} from '../firebase';
import { Label,Icon,Button } from 'semantic-ui-react';

export default function ClassMates(props){
    const [students,setStudents]=  useState([]);
    const [teacher,setTeacher] = useState(false);

    useEffect(()=>{
        db.collection('users').doc(auth.currentUser.email).get()
        .then(doc=>{
            if(doc.data().profession=="teacher")
            setTeacher(true);
        }).catch(err=>console.log(err));

        const unsubs = db.collection('partof').where('class','==',props.classid).onSnapshot(snap=>{
            setStudents([])
            getStudents();
        })

        return ()=>{
            unsubs();
        }
    },[])

    const colors=['teal','blue','red','olive','green','violet']

    function removeStudent(e){

        const stuemail = e.target.attributes.getNamedItem("email").value;
        db.collection('partof').where('student','==',stuemail).get()
        .then(querydocs=>{
            if(!querydocs.empty)
            querydocs.docs[0].ref.delete();
        })

        db.collection('taken').where('student','==',stuemail).get()
        .then(querydocs=>{
            if(!querydocs.empty)
            querydocs.docs[0].ref.delete();
        })

        
    }

    function getStudents(){
        db.collection('partof').where('class','==',props.classid).orderBy('joined',"asc").get()
        .then(queryss=>{
             queryss.docs.forEach(doc=>{
                 db.collection('users').doc(doc.data().student).get()
                 .then(studentdoc=>{
                          setStudents(prev=>{
                              return [{
                             email:studentdoc.id,
                             username: studentdoc.data().username,
                             photoUrl: studentdoc.data().photoUrl
                         },...prev]
                     });
                     })
 
                 })
             })
    }
    return (
        <div>
            {students.map((student,i)=>(
                    <Label style={{margin:"1%"}} color={colors[i%6]} size="huge" key={student.email} image>
                    <img src={student.photoUrl?student.photoUrl:"https://i.ibb.co/TWVPkMp/user-2.png"} />
                    {student.username}
                    {teacher&&<Icon email={student.email} onClick={removeStudent} name='delete'/>}
                  </Label>
            ))}
        </div>
    )
}