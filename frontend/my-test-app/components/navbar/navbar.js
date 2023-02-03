import styles from './navbar.module.css';
import Image from 'next/image'
import Login from './login/login'
import SignUp from './signUp/signUp'
import Link from 'next/link'
import { motion } from 'framer-motion';
import {useRouter} from 'next/router';
import Search from './search/search'
import AuthContext from '../../context/auth'
import {useContext, useEffect, useState} from 'react'
import Modal from 'react-modal';
import LoadingBar from 'react-top-loading-bar'

const Navbar = () => {
    const router = useRouter()

    const {user, setUser, fetchUser} = useContext(AuthContext)
    useEffect(() => {
        fetchUser()
    }, [router.isReady, user])

    const [profileClicked, setProfileClicked] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [username, setUsername] = useState(user || 'Test User')
    const [email, setEmail] = useState('')
    const [searchClicked, setSearchClicked] = useState(false)
    const [password, setPassword] = useState('')
    const [progress, setProgress] = useState(0)
    // const [samePass, setSamePass] = useState(false)



    useEffect(() => {
        if (user !== null) {
            setIsLoggedIn(true)
        }
        localStorage.setItem("theme", "light_mode")
    }, [user])



    const handleProfileClick = () => {
        setProfileClicked(!profileClicked)
    }

    const handleLoginClick = () => {
        setLoginModal(true) 
        setProfileClicked(false)
    }

    const handleRegisterClick = () => {
        setRegisterModal(true) 
        setProfileClicked(false)
    }

    const handleSignOutClick = () => {
        localStorage.removeItem("access_token")
        setUser(null)
        setIsLoggedIn(false)
        setProfileClicked(false)
        setUser(null)
    }

    const darkLightMode = (option) => {
        localStorage.setItem("theme", option)
    }

  return (
    <div>
        <div className={styles.container}>
            <div className={styles.navContainer}>
                <Image className={styles.profileIcon} onClick={() => {router.push("/")}} src="/static/Logo Orange.svg" alt="NoteShare Logo" width="100%" height="100%"  layout="responsive"  objectFit="contain" />    
                    <input className={styles.search} onFocus={() => {setSearchClicked(true); setProgress(100)}} onBlur={() => {setSearchClicked(false)}} placeholder="Search for Libraries and Books" />
                <Image className={styles.profileIcon} onClick={handleProfileClick} alt="Logo Icon" src="/static/Profile.svg" width="100%" height="100%"  layout="responsive"  objectFit="contain" />
            </div>
        </div>
        {
            profileClicked && 
            <motion.div className={styles.profileDropDown} initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0, 0.71, 0.2, 1.01]
            }}>
            {
                isLoggedIn &&
                <div>
                    <Link href={`/profiles/myprofile`}>
                        <p className={styles.dropDownText}>{user}</p>
                    </Link>
                    <p className={styles.dropDownText} onClick={handleSignOutClick}>Sign Out</p>
                    <p className={styles.dropDownText}>
                    <Image src={"/static/LightMode.svg"} width="100%" height="100%"  layout="responsive"  objectFit="contain" onClick={() => {darkLightMode("dark_mode")}}></Image>
                    
                    </p>
                </div>
            }
            {
                isLoggedIn === false &&
                <div>
                    <div onClick={handleLoginClick}><p className={styles.dropDownText}>Login</p></div>
                    <div onClick={handleRegisterClick}><p className={styles.dropDownText}>Register</p></div>                    
                </div>

            }
            

            
        </motion.div>
        }
        <Modal isOpen={loginModal} 
        closeTimeoutMS={500}
        ariaHideApp={false}
        onRequestClose={() => setLoginModal(false)}
                style={
            {
                overlay: {
                    color: '#fff',
                    background: 'rgba( 0, 0, 0, 0.0 )',
                    backdropFilter: 'blur(15px)',
                    zIndex: '900'
                },
                content: {
                    width: '90%',
                    justifyContent: 'center',
                    margin: 'auto',
                    height: "90vh",
                    overflowX: "hidden",
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.65)',
                    border: 0,
                    borderRadius: '2vw',
                    zIndex: '900'
                    
                }
            }
        }>
            <Login registerModal={setRegisterModal} closeLoginModal={setLoginModal} setIsLoggedIn={setIsLoggedIn} setEmail={setUsername} email={username}/>
        </Modal>

        <Modal isOpen={registerModal} 
        closeTimeoutMS={500}
        ariaHideApp={false}
        onRequestClose={() => setRegisterModal(false)}                
        style={
            {
                overlay: {
                    color: '#fff',
                    background: 'rgba( 0, 0, 0, 0.0 )',
                    backdropFilter: 'blur(15px)',
                    zIndex: '900'
                },
                content: {
                    width: '90%',
                    justifyContent: 'center',
                    margin: 'auto',
                    height: "90vh",
                    overflowX: "hidden",
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.65)',
                    border: 0,
                    borderRadius: '2vw',
                    zIndex: '900'
                    
                }
            }
        }>
            <SignUp loginModal={setLoginModal} closeRegisterModal={setRegisterModal} closeLoginModal={setLoginModal} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
        </Modal>
        {
            searchClicked &&
            <Search />
        }
        <div className={styles.categoriesWrapper}>
            <div className={styles.navCategories}>
                <Link href={"/explore"} >
                    <div>
                        <h2 className={styles.category} style={router.asPath.includes('explore/explore') ? {fontWeight:600}: {fontWeight:200}}>
                            
                                Explore
                            
                        </h2>
                    </div>
                </Link>
                    <hr className={styles.hr} />
                    <Link href={"/libraries"} >
                <div>
                    <h2 className={styles.category} style={router.route === '/libraries' ? {fontWeight:600}: {fontWeight:200}}>
                        
                            Libraries  
                         
                    </h2>  
                </div>  
                 </Link>         
            </div>
        </div>
    </div>

  )
}

export default Navbar