import React, { useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import AOS from "aos";
import "aos/dist/aos.css";
import "./BodyLogin.css";

AOS.init();

function BodyLogIn() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  function handleLoginOpen() {
    setOpenLogin(true);
  }
  function handleLoginClose() {
    setOpenLogin(false);
  }
  function handleSignupOpen() {
    setOpenSignup(true);
  }
  function handleSignupClose() {
    setOpenSignup(false);
  }
  return (
    <div className="login">
      <section
        className="gettingstarted"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div className="introduction">
          <span>Welcome to Atom</span>
          <h2>An Online Classroom Solution</h2>
          <span className="login__button">
            <Button color="red" onClick={handleLoginOpen}>
              Get Started <Icon name="arrow right" />
            </Button>
          </span>
        </div>
      </section>
      <section
        className="features"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        Features appear here.
      </section>
      <LogInForm
        open={openLogin}
        Close={handleLoginClose}
        signupOpen={handleSignupOpen}
      />
      <SignUpForm open={openSignup} Close={handleSignupClose} />
    </div>
  );
}
export default BodyLogIn;
