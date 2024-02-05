import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [bio, setBio] = useState("");

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("https://full-stack-project-rup2.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert("Signup failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-div">
      <h1>Welcome New User!</h1>
      <h2>Create an Account Below</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
          imageURL: "",
          bio: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .required("Username is required"),
          password: Yup.string()
            .required("Password is required"),
          imageURL: Yup.string()
            .url("Invalid URL format")
            .required("Profile image URL is required"),
          bio: Yup.string()
        })}
        onSubmit={handleSignup}
      >
        <Form>
          <div className="input-group">
            <label>Username:</label>
            <Field type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <ErrorMessage name="username" />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <Field type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ErrorMessage name="password" />
          </div>
          <div className="input-group">
            <label>Profile image URL:</label>
            <Field type="text" name="imageURL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
            <ErrorMessage name="imageURL" />
          </div>
          <div className="input-group">
            <label>Bio:</label>
            <Field type="text" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <button type="submit">Create Account</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Signup;