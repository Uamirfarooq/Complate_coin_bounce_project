import Navbar from "./components/navbar/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import styles from './App.module.css'
import Protected from "./components/protected/protected";
import Error from "./pages/Home/Error/Error";
import Login from './pages/Login/Login'
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import Signup from "./pages/signup/signup";



function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path='/'
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />
            <Route
              path='/crypto'
              exact
              element={
                <div className={styles.main}>
                  crypto page
                </div>
              }
            />
            <Route
              path='/blogs'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                  blogs page
                </div>
                </Protected>
              }
            />
            <Route
              path='/submit'
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                  submit blog page page
                </div>
                </Protected>
              }
            />
            <Route
              path='/signup'
              exact
              element={
                <div className={styles.main}>
                  <Signup/>
                </div>
              }
            />
            <Route
              path='/login'
              exact
              element={
                <div className={styles.main}>
                  <Login/>
                </div>
              }
            />
            <Route
            path="*"
            element= {<div className={styles.main}><Error/></div>}
              />
            </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
