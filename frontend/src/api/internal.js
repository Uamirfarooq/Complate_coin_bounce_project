import axios from "axios";

const api = axios.create({
    baseURL:process.env.REACT_APP_INTERNAL_API_PATH,
    withCredentials:true,
    headers:{
        "Content-type" : "application/json",
    }
});

export const login = async (data)=>{
    let responce;

    try {
        responce = await api.post('/login',data)
    } catch (error) {
        return error;
    }
    return responce;
};
export const signup = async (data)=>{
    let responce;

    try {
        responce = await api.post('/register',data)
    } catch (error) {
        return error;
    }
    return responce;
};
export const signout = async () =>{
    let responce;
    try {
        responce = await api.post('/logout');
    } catch (error) {
        return error;
    }
    return responce;
}