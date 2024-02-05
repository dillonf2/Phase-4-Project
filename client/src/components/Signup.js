import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Signup() {
  const [signupError, setSignupError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      imageURL: "",
      bio: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, "Username must be at least 3 characters long"),
      password: Yup.string().min(6, "Password must be at least 6 characters long"),
      imageURL: Yup.string().url("Invalid URL format"),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
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
          const data = await response.json();
          setSignupError(data.error || "Signup failed");
        }
      } catch (error) {
        console.error("An error occurred during signup:", error);
        setSignupError("Signup failed");
      }
    },
  });

  return (
    <div className="signup-div">
      <h1>Welcome New User!</h1>
      <h2>Create an Account Below</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error">{formik.errors.username}</div>
          )}
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>
        <div className="input-group">
          <label>Profile image URL:</label>
          <input
            type="text"
            {...formik.getFieldProps("imageURL")}
          />
          {formik.touched.imageURL && formik.errors.imageURL && (
            <div className="error">{formik.errors.imageURL}</div>
          )}
        </div>
        <div className="input-group">
          <label>Bio:</label>
          <input
            type="text"
            {...formik.getFieldProps("bio")}
          />
        </div>
        {signupError && <div className="error">{signupError}</div>}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;