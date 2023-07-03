import * as yup from 'yup'
const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const errorMessage = 'Use lower and high case and some numerious value'
 
const loginSchema = yup.object().shape({
    username : yup.string().min(5).max(30).required(),
    password: yup.string().min(8).max(25).matches(passwordPattren,{message : errorMessage}).required()
});
export default loginSchema;