import Navbar from '../components/navbar/navbar'
import SectionCards from '../components/library_cards/sectionCards/SectionCards'
import TrendingLibraries from '../components/trending_libraries/trending_libraries'
import NotSignedInLibraries from '../components/notSignedInLibraries/unSignedLibraries'
import { motion } from 'framer-motion'
import {useRouter} from 'next/router'

import AuthContext from '../context/auth'
import {useContext, useEffect, useState} from 'react'

import Link from 'next/link'

import files from '../data/files.json'
import styles from '../styles/explore.module.css'
import Loading from '../components/loading/loading'

const Libraries = () => {

  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [trendingLibraries, setTrendingLibraries] = useState([])
  const [filteredLibraries, setFilteredLibraries] = useState([])
  const [myAdminLevel, setMyAdminLevel] = useState("")
  const [searchField, setSearchField] = useState("")

  const [trendingLoaded, setTrendingLoaded] = useState(false)
  const [myLibrariesLoaded, setMyLibrariesLoaded] = useState(false)

  const [joined, setJoined] = useState(false)
  const [didJoined, setDidJoined] = useState(false)

  const {user, fetchUser, userId} = useContext(AuthContext)
  const [publicLibraries, setPublicLibraries] = useState([])
  const [libCreated, setLibCreated] = useState(false)
  const [followingUsers, setFollowingUsers] = useState({})

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

    const getBooksFromFollowing = async() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const res = await fetch("https://noteshare.live/api/followers/following?limit=5", requestOptions)
      if (res.status == 200) {
          const publicDefaultLibraries = await res.json();
          console.log(publicDefaultLibraries)          

          publicDefaultLibraries.map((user) => {
            const userFollowing = async() => {
              const res = await fetch(`https://noteshare.live/api/books/user-public-books-default/${user.user_id}?limit=5`, requestOptions)
                if (res.status == 200) {
                    const userBooks = await res.json();
                    console.log(`${user.username}`, userBooks)
                    setFollowingUsers(
                      {
                        followingUsers,
                        [user.username]: userBooks
                        
                    }
                    ) 
                } else {
                    console.log('failed fetching user')
                }
            }
            userFollowing()
          })
          console.log(followingUsers)

      } else {
          console.log('failed fetching following')
      }
    }

  const getPublicLibrariesDefault = async() => {
      const res = await fetch("https://noteshare.live/api/libraries/public-default?limit=15", requestOptions)
      if (res.status == 200) {
          const publicDefaultLibraries = await res.json();
          setMyLibrariesLoaded(true)
          setPublicLibraries(publicDefaultLibraries)
          
      } else {
          alert('failed creating book')
      }
  }
  // console.log({publicLibraries})
  useEffect(() => {
      getPublicLibrariesDefault()
  }, [])

  useEffect(() => {
    setFilteredLibraries(libraries.filter(library =>
    library.title.toLowerCase().includes(searchField.toLowerCase())
))
}, [searchField])

  useEffect(() => {
    // if (!router.isReady) return;
      fetchUser()
      // console.log("libraries", user)
      if (user !== null) {
          setIsLoggedIn(true)
          getBooksFromFollowing()
          // console.log("Libraries: logged in")
          getMyLibraries()
      } else {
        setIsLoggedIn(false)
        // console.log("Libraries: not logged")
      }     
  }, [router.isReady, user, joined, didJoined, libCreated])

  const getMyLibraries = async(event) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));

    var requestMyLibOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const fetchMyLibraries = async() => {
      const res = await fetch("https://noteshare.live/api/libraries/mine/", requestMyLibOptions)
      if (res.status == 200) {
        const myLibraries = await res.json();
        setLibraries(myLibraries)
        setFilteredLibraries(myLibraries)
        setMyLibrariesLoaded(true)
        // console.log({myLibraries})
      } 
      else if (res.status == 401) {
        setIsLoggedIn(false)
        localStorage.removeItem("access_token")
        alert("Error: Session Expired, Please Sign In Again")
      } 
      else {
        alert('failed fetching my libraries')
      }
    } 

  fetchMyLibraries()    
}

const getTrendingLibraries = async() => {
  var requestMyLibOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const fetchTrendingLibraries = async() => {
    const res = await fetch("https://noteshare.live/api/libraries/public-default", requestMyLibOptions)
    if (res.status == 200) {
      const trendingLibraries = await res.json();
      setTrendingLibraries(trendingLibraries)
      setTrendingLoaded(true)
      // console.log({trendingLibraries})

    } else {
      alert('failed fetching my libraries fetch trending libraries')
    }
  } 

  fetchTrendingLibraries() 
}

useEffect(() => {
  getTrendingLibraries()
}, [])


  return (
    <div className={styles.container}>

      <Navbar />
     <div>
     {!trendingLoaded &&
      <Loading />
    }
     {trendingLoaded &&
      <TrendingLibraries setLibCreated={setLibCreated} libCreated={libCreated} libraries={trendingLibraries} joined={joined} setJoined={setJoined} />
    }
      
    {myLibrariesLoaded &&
      <div>
      {!isLoggedIn &&
        <div>
          <motion.div className={styles.notSignedIn} initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}>
            <h2><b className={styles.loginAndRegister} onClick={() => {router.push('/login')}}>Login</b> or <b className={styles.loginAndRegister} onClick={() => {router.push('/signup')}}>register</b> to join and view <b>My Libraries</b> </h2> 
            <p>In the mean time, you can view the top libraries ;)</p>
          </motion.div>
          <NotSignedInLibraries publicLibraries={publicLibraries} />
        </div>
      }

      {isLoggedIn &&
        <div>
        <div className={styles.filteredLibrariesWrapper}>
           <input className={styles.filteredLibrariesInput} onChange={(e) => {setSearchField(e.target.value)}} placeholder="search your libraries" />
        </div>
          {
            filteredLibraries.map((item, idx) => {
              // console.log(item)
              return(
                <SectionCards key={idx} books={files} libId={item.id} library={item.title} banner={item.banner} visibility={item.public} patrons={item.patrons}/> 
              )
                       
            })
          }    
          {/* 
        <div className={styles.newLibrariesWrapper}>
          <Link href={'/explore/libraries'}>
            <h2>Find New Libraries</h2>
          </Link>
          </div>  
        */} 
             
        </div>
      }

      {isLoggedIn &&
        <div>
        { libraries.length <= 0 &&
          <div className={styles.noPatronedLibraries}>
            <h2>
              You are not a patron of any libraries :(
            </h2>
          </div>
        }        
      </div>

    }
      </div>
    
    }

    {!myLibrariesLoaded &&
    <Loading />
    }
     </div>
    </div>
  )
}

export default Libraries;