import styles from "./signup.module.css";
import { useState } from "react";
import { signup } from "../../api/internal";
import TextInput from "../../components/TextInput/TextInput";
import { useFormik } from "formik";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import signupSchema from '../../Schemas/signupSchema'

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const responce = await signup(data);

    if (responce.status === 201) {
      const user = {
        _id: responce.data.user._id,
        email: responce.data.user.email,
        username: responce.data.user.username,
        auth: responce.data.auth,
      };
      dispatch(setUser(user));
      //redirect -> homepage
      navigate("/");
    } else if (responce.code === "ERR_BAD_REQUEST") {
      setError(responce.responce.data.message);
    }
  };
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: signupSchema,
  });
  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create an Account</div>
      <TextInput
        type="text"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="name"
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
      <TextInput
        type="text"
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="text"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />
      <TextInput
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <TextInput
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="conformPassword"
        error={
          errors.confirmPassword && touched.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />

      <button className={styles.signupButton} onClick={handleSignup}
      disabled={
        !values.username ||
        !values.password ||
        !values.confirmPassword ||
        !values.name ||
        !values.email ||
        errors.username ||
        errors.password || 
        errors.confirmPassword ||
         errors.name || 
         errors.email
      }
      >
        signUp
      </button>

      <span>
        already have an account{" "}
        <button className={styles.login} onClick={() => navigate("/login")}>
          Log In
        </button>
      </span>

      {error != "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}
export default Signup;
