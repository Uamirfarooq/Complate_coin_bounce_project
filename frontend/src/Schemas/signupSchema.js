import * as yup from "yup"

const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const errorMessage = 'use lowercase uppercase and digits'
const signupSchema = yup.object().shape({
    name: yup.string().max(30).required('Name is required'),
    username: yup.string().min(5).max(30).required('UserName is Required'),
    email: yup.string().required('Emain s required').email('Enter a valid email'),
    password: yup.string().min(8).max(25).matches(passwordPattren,{message : errorMessage}).required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')],'password must match').required('enter your password again')
});
export default signupSchema;