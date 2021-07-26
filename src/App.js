import Header from "./Header/Header";
import BodyLogIn from "./Body/BodyLogIn";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import TeachersPage from "./Body/TeachersPage";
import StudentPage from "./Body/StudentsPage";
function App() {
  const [user, setUser] = useState(null);
  const [profession, setProfession] = useState("");
  const [bodyloaded, setBodyLoaded] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        //user is logged in
        setUser(user);
      } else {
        //user has logged out
        setUser(null);
        setProfession("");
      }
    });

    user
      ? db
          .collection("users")
          .doc(auth.currentUser.email)
          .get()
          .then((doc) => {
            setProfession(doc.data().profession);
            setBodyLoaded(true);
          })
          .catch((err) => {
            console.log(err);
          })
      : setTimeout(() => {
          setBodyLoaded(true);
        }, 3000);

    return () => {
      unsubscribe();
    };
  }, [user]);
  return (
    <div className="app">
      <div className="app__header">
        <Header user={user ? user : null} />
      </div>
      <div className="app__body">
        {bodyloaded &&
          (user ? (
            profession === "teacher" ? (
              <TeachersPage />
            ) : (
              <StudentPage />
            )
          ) : (
            <BodyLogIn
              setUser={setUser}
              setProfession={setProfession}
              getProfession={profession}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
