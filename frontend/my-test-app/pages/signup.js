import styles from '../styles/signup.module.css'
import {useState} from 'react'
import {useRouter} from 'next/router'
import router from 'next/router'
import Navbar from '../components/navbar/navbar'

const SignUp = (props) => {

    const router = useRouter()

    const handleSubmitSignUp = async(event) => {
      event.preventDefault()

      const username = document.getElementById('username').value
      const email = document.getElementById('email').value
      const pass = document.getElementById('password').value

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "email": email,
        "username": username,
        "password": pass
      });       
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const res = await fetch("https://noteshare.live/api/users/", requestOptions)
        if (res.status == 201) {
          const result = await res.json();          
          setIsLoggedIn(true)
          closeRegisterModal(false)
          closeLoginModal(true)
        } else {
          alert('Creating User failed.')
          setIsLoggedIn(false)
          closeRegisterModal(true)
      }

    }

    const validatePassword = () => {
      const pass = document.getElementById('password')
      const confirmPass = document.getElementById('confirmPassword')
          if(pass.value != confirmPass.value) {
            confirmPass.setCustomValidity("Passwords Don't Match");
          } else {
            confirmPass.setCustomValidity('');
          }
      }

      const createNewUser = () => {

      }
      const LoginModal = () => {
        router.replace("/login")
      }

      const scaleUp = {scale: 1.1};
      const scaleDown = {scale: 0.95}

  return (
    <div className={styles.container}>
    <Navbar />

    <div className={styles.loginContainer}>
    <h1 className={styles.header}>Join The Community!</h1>
          <form className={styles.form} onSubmit={handleSubmitSignUp} id="signUpForm">
          <label className={styles.loginLabels}>Username</label>
          <input className={styles.username} id="username" onChange={() => {}} required placeholder="Username"/>
          <label className={styles.loginLabels}>Email</label>
          <input className={styles.email} type="email" id="email" required placeholder="Email"/>
          <label className={styles.loginLabels}>Password</label>
          <input className={styles.password} type="password" onChange={validatePassword} id="password" required placeholder="Passowrd"/>
          <label className={styles.loginLabels}>Confirm Password</label>
          <input className={styles.SignUpConfirm} type="password" onChange={validatePassword} id="confirmPassword" required placeholder="Confirm Password"/>
      </form>
          <button type="submit" form="signUpForm" className={styles.submit}>Sign Up</button>
    </div>

        <p>Already Have An Account? <b onClick={() => {router.push("/login")}} className={styles.login}>Log In</b></p>

</div>
  )
}

export default SignUp