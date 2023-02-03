import Navbar from '../components/navbar/navbar'
import styles from '../styles/login.module.css'
import { motion } from 'framer-motion'

import {useState} from 'react'
import {useRouter} from 'next/router'

import AuthContext from '../context/auth'
import {useContext, useEffect} from 'react'

const Login = () => {
    const router = useRouter();
  
    const {user, setUser, fetchUser} = useContext(AuthContext)

    // const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginClicked, setLoginClicked] = useState(false)

    useEffect(() => {
      fetchUser()
      console.log("login", user)
      if (user !== null) {
          console.log("log in: logged in")
      } else {
        console.log("log in: not logged")
      }     
  }, [router.isReady, user])

    function handleEmailChange(e) {
      setEmail(e.target.value);
      console.log(email)
    }
  
    function handlePasswordChange(e) {
      setPassword(e.target.value);
      console.log(password)
    }

    const handleSubmitLogin = async(event) => {
        event.preventDefault()
        setLoading(true)

        var formdata = new FormData();
        formdata.append("username", email);
        formdata.append("password", password);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };
        const res = await fetch("https://noteshare.live/api/login", requestOptions)
        if (res.status == 200) {
          const result = await res.json();          
          localStorage.setItem('access_token', String(result.token_type + " " + result.access_token));
            router.push('/libraries')
            setLoading(false)
        } else {
          alert('Login failed.')
          setLoading(false)
        }
        fetchUser()
        console.log(email, password)
    }

    const createAccount = () => {
    }

    const scaleUp = {scale: 1.1};
    const scaleDown = {scale: 0.95}

    const variants = {
      clicked: { scale: 1.1 },
      notClicked: { scale: 1 },
    }

    return (

        <div className={styles.container}>
            <Navbar />
            <div className={styles.loginContainer}>    
            <h1 className={styles.header}>Welcome Back!</h1>
                <motion.form onSubmit={handleSubmitLogin} id="login" className={styles.form} animate={loginClicked ? "clicked":"notClicked"}
                variants={variants}
                > 
                    <label className={styles.loginLabels}>Email</label>
                    <input type="email" onFocus={() => {setLoginClicked(true)}} onBlur={() => {setLoginClicked(false)}} onChange={handleEmailChange}  className={styles.email} id="email" />
                    <label className={styles.loginLabels}>Password</label>
                    <input type="password" onFocus={() => {setLoginClicked(true)}} onBlur={() => {setLoginClicked(false)}} onChange={handlePasswordChange} className={styles.password} id="password" />
                    
                </motion.form>
                {!loading &&
                <button type="submit" form="login" className={styles.submit}>Login</button>
                }
                {loading &&
                <button className={styles.submit} disabled>Logging In</button>
                }
            </div>
            <p>New to NoteShare? <b onClick={() => {router.push("/signup")}} className={styles.signup}>Create An Account.</b></p>
            
        </div>
    )
}

export default Login;