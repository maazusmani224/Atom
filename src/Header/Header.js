import React, { useEffect, useState } from "react";
import { Avatar, Input } from "@material-ui/core";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { db, auth, store } from "../firebase";
import {
  Popup,
  Icon,
  Segment,
  Divider,
  Progress,
  Button,
  Modal,
  Image,
} from "semantic-ui-react";
import "./Header.css";

function Header() {
  const [openEdit, setOpenEdit] = useState(false);
  const [nameeditdisabled, setNameEditDisabled] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newusername, setNewUsername] = useState("");
  const [photourl, setPhotoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [selectavataropen, setSelectAvatarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const SemanticAvatar = [
    {
      small: "https://i.ibb.co/kHcbTHr/veronika-small.jpg",
      large: "https://i.ibb.co/wNCpdnm/veronika-large.jpg",
    },
    {
      small: "https://i.ibb.co/2jPtyTK/stevie-small.jpg",
      large: "https://i.ibb.co/qNhgrGh/stevie-large.jpg",
    },
    {
      small: "https://i.ibb.co/rsTNySv/steve-small.jpg",
      large: "https://i.ibb.co/cYPTvcy/steve-large.jpg",
    },
    {
      small: "https://i.ibb.co/BN2Q06s/nan-small.jpg",
      large: "https://i.ibb.co/Gxh8J50/nan-large.jpg",
    },
    {
      small: "https://i.ibb.co/HPKmRkr/molly-small.png",
      large: "https://i.ibb.co/5Tn76Pf/molly-large.png",
    },
    {
      small: "https://i.ibb.co/qCSnFxW/matthew-small.png",
      large: "https://i.ibb.co/jDRfZDf/matthew-large.png",
    },
    {
      small: "https://i.ibb.co/d41HZ3j/laura-small.jpg",
      large: "https://i.ibb.co/7RFFLfq/laura-large.jpg",
    },
    {
      small: "https://i.ibb.co/qgVxkhp/justen-small.jpg",
      large: "https://i.ibb.co/YdPWPCF/justen-large.jpg",
    },
    {
      small: "https://i.ibb.co/NC6wY69/joe-small.jpg",
      large: "https://i.ibb.co/PcFpR8c/joe-large.jpg",
    },
    {
      small: "https://i.ibb.co/ZMX6BSP/jenny-small.jpg",
      large: "https://i.ibb.co/4dXLtNh/jenny-large.jpg",
    },
    {
      small: "https://i.ibb.co/zPL3nmj/helen-small.jpg",
      large: "https://i.ibb.co/LSTry9R/helen-large.jpg",
    },
    {
      small: "https://i.ibb.co/8xKVxJV/elliot-small.jpg",
      large: "https://i.ibb.co/NCQmVpw/elliot-large.jpg",
    },
    {
      small: "https://i.ibb.co/q9H0KQS/daniel-small.jpg",
      large: "https://i.ibb.co/k4JB8gt/daniel-large.jpg",
    },
    {
      small: "https://i.ibb.co/mcmyZ47/christian-small.jpg",
      large: "https://i.ibb.co/xqT7L5T/christian-large.jpg",
    },
    {
      small: "https://i.ibb.co/j5kxGwz/chris-small.jpg",
      large: "https://i.ibb.co/s1Rp8LX/chris-large.jpg",
    },
    {
      small: "https://i.ibb.co/pb2C5Tx/ade-small.jpg",
      large: "https://i.ibb.co/dBHVXsS/ade-large.jpg",
    },
    {
      small: "https://i.ibb.co/C07JR15/lena.png",
      large: "https://i.ibb.co/C07JR15/lena.png",
    },
    {
      small: "https://i.ibb.co/hWPBFGp/lindsay.png",
      large: "https://i.ibb.co/hWPBFGp/lindsay.png",
    },
    {
      small: "https://i.ibb.co/mBbRxNb/mark.png",
      large: "https://i.ibb.co/mBbRxNb/mark.png",
    },
    {
      small: "https://i.ibb.co/j4hXwHV/tom-small.jpg",
      large: "https://i.ibb.co/kXv6VDN/tom-large.jpg",
    },
    {
      small: "https://i.ibb.co/dkZppL1/user-1.png",
      large: "https://i.ibb.co/dkZppL1/user-1.png",
    },
    {
      small: "https://i.ibb.co/xg0n6PS/user.png",
      large: "https://i.ibb.co/xg0n6PS/user.png",
    },
    {
      small: "https://i.ibb.co/FHSCrrG/man-2.png",
      large: "https://i.ibb.co/FHSCrrG/man-2.png",
    },
    {
      small: "https://i.ibb.co/K5tRG9X/man-1.png",
      large: "https://i.ibb.co/K5tRG9X/man-1.png",
    },
    {
      small: "https://i.ibb.co/YNWBY5M/man.png",
      large: "https://i.ibb.co/YNWBY5M/man.png",
    },
    {
      small: "https://i.ibb.co/D7NnKxd/indian.png",
      large: "https://i.ibb.co/D7NnKxd/indian.png",
    },
    {
      small: "https://i.ibb.co/rvYfjqT/gamer.png",
      large: "https://i.ibb.co/rvYfjqT/gamer.png",
    },
    {
      small: "https://i.ibb.co/1zZq07C/boy.png",
      large: "https://i.ibb.co/1zZq07C/boy.png",
    },
    {
      small: "https://i.ibb.co/VWvQ5z7/bussiness-man.png",
      large: "https://i.ibb.co/VWvQ5z7/bussiness-man.png",
    },
  ];

  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        setUser(authuser);
      } else {
        setUser(null);
      }
    });

    user &&
      db
        .collection("users")
        .doc(auth.currentUser.email)
        .onSnapshot((snapshot) => {
          setPhotoUrl(snapshot.data().photoUrl);
          setUsername(snapshot.data().username);
        });
  }, [user]);

  //logs user out
  function logOut() {
    auth.signOut().catch((error) => {
      console.log(error.message);
    });
  }
  //opens edit dialog box
  function editProfile() {
    setOpenEdit(true);
  }
  //closes edit dialog box
  function closeEdit() {
    setOpenEdit(false);
    setNameEditDisabled(true);
  }
  // opens a file selector
  function selectImage() {
    document.getElementById("profileImage").click();
  }
  //uploads the image
  function uploadImage(event) {
    const image = event.target.files[0];
    if (image) {
      const uploadTask = store.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageUploading(true);
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (error) => {
          console.log(error);
        },
        () => {
          setImageUploading(false);
          store
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              auth.currentUser.updateProfile({ photoURL: url });
              return db
                .collection("users")
                .doc(auth.currentUser.email)
                .update({ photoUrl: url });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    }
  }
  //edit the usename
  function editName(event) {
    if (newusername.length !== 0) {
      auth.currentUser.updateProfile({ displayName: newusername });
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({ username: newusername })
        .then(() => {
          console.log("Name changed");
        })
        .catch((err) => {
          console.log(err);
        });
      closeEdit();
    } else {
      alert("Username cannot be blank");
    }
  }

  function enableEditing() {
    setNameEditDisabled(false);
  }

  function openAvatarSelect() {
    closeEdit();
    setSelectAvatarOpen(true);
  }

  function setAvatar(event) {
    console.log(event.target.id);
    auth.currentUser.updateProfile({
      photoURL: SemanticAvatar[event.target.id].small,
    });
    db.collection("users")
      .doc(auth.currentUser.email)
      .update({ photoUrl: SemanticAvatar[event.target.id].small });
    setSelectAvatarOpen(false);
    setOpenEdit(true);
  }

  return (
    <div className="header__main">
      <div className="header__left">
        <img
          className="logo"
          src="https://i.ibb.co/3v4tW1Q/atomic-energy.png"
          alt="logo"
        ></img>
        <p>Atom</p>
      </div>

      {user ? (
        <Popup
          className="header__popup__menu"
          trigger={
            <div className="header__right">
              <div className="header__username">{user.displayName}</div>
              <Avatar
                className="header__avatar"
                src={photourl}
                alt={username}
              />
            </div>
          }
          floating
          hoverable
          position="bottom right"
        >
          <div onClick={editProfile} className="menu__icons">
            <Icon color="black" name="edit" size="big" />
            Edit Profile
          </div>
          <Divider section />
          <div onClick={logOut} className="menu__icons">
            <Icon color="black" name="power off" size="big" />
            Log out
          </div>
        </Popup>
      ) : (
        <div className="header__right"></div>
      )}
      <Dialog open={openEdit} onClose={closeEdit}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div className="editprofile__avatar">
            {imageUploading ? (
              <Progress
                size="small"
                color="green"
                value={progress}
                total="100"
                progress="percent"
              />
            ) : (
              <Avatar
                src={user ? photourl : ""}
                alt={user ? username : ""}
                className="avatar__large"
              ></Avatar>
            )}
            <input
              type="file"
              id="profileImage"
              style={{ display: "none" }}
              onChange={uploadImage}
            />
            <div className="selectimagebutton">
              <Button
                className="selectimagebutton"
                basic
                onClick={selectImage}
                color="green"
              >
                Select Image
              </Button>
              <Button
                className="selectimagebuuton"
                basic
                color="green"
                onClick={() => {
                  openAvatarSelect();
                }}
              >
                Select Avatar
              </Button>
            </div>
          </div>
          <div className="editprofile__name" onClick={enableEditing}>
            <Input
              disabled={nameeditdisabled}
              type="text"
              defaultValue={user ? user.displayName : ""}
              autoComplete="off"
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
            <Button
              className="saveusernamebutton"
              onClick={editName}
              color="green"
            >
              <Icon name="save" />
              Save Changes
            </Button>
          </div>
          <div className="cancelbutton">
            <Button
              basic
              color="red"
              onClick={() => {
                setOpenEdit(false);
                setNameEditDisabled(true);
              }}
            >
              <Icon name="cancel" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        className="avatarselectmodal"
        basic
        open={selectavataropen}
        onClose={() => {
          setSelectAvatarOpen(false);
          setOpenEdit(true);
        }}
        onOpen={() => setSelectAvatarOpen(true)}
      >
        <h3 className="ui header">
          <div className="avatarsgrid" style={{ margin: "0" }}>
            {SemanticAvatar.map((avatar, index) => (
              <div className="avatarsgriditems" key={index} onClick={setAvatar}>
                <Image id={index} src={avatar.large} size="small" circular />
              </div>
            ))}
          </div>
        </h3>
        <Modal.Actions>
          <Button
            basic
            color="orange"
            onClick={() => {
              setSelectAvatarOpen(false);
              setOpenEdit(true);
            }}
          >
            <Icon name="cancel" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
export default Header;
