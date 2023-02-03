import {useState, useEffect, useContext, Fragment} from 'react'
import AuthContext from '../../context/auth'

import {useRouter} from 'next/router'

import PatronRequests from '../../components/patrons/patronRequests/patronRequests'
import PatronInvites from '../../components/patrons/patronInvites/patronInvites'

import Navbar from "../../components/navbar/navbar"

import Image from 'next/image'

import styles from '../../styles/profile.module.css'

import LibraryCard from '../../components/library/libraryCard'

import Link from 'next/link'


const Profile = () => {

  const router = useRouter()

  const [myLikedBooksToggle, setmyLikedBooksToggle] = useState(true)
  const [myBooksToggle, setMyBooksToggle] = useState(false)
  const [filteredLikedBooks, setFilteredLikedBooks] = useState([])
  const [likedBooks, setLikedBooks] = useState([])
  const [searchField, setSearchField] = useState('')
  const [username, setUsername] = useState('')
  const [userFollowers, setUserFollowers] = useState('')
  const [userFollowing, setUserFollowing] = useState('')
  const [bookDeleted, setBookDeleted] = useState(false)
  const [bookEdited, setBookEdited] = useState(false)

  const [sessionExpired, setSessionExpired] = useState(false)

  const [myBooks, setMyBooks] = useState([])
  const [filteredMyBooks, setFilteredMyBooks] = useState([])  

  const [isMyProfile, setIsMyProfile] = useState(false)

  const [patronRequestList, setPatronRequestList] = useState([])
  const [requestsChanged, setRequestsChanged] = useState([])
  const [patronInviteList, setPatronInviteList] = useState([])
  const [invitesChanged, setInvitesChanged] = useState([])


  const {user, followers, following, fetchUser} = useContext(AuthContext)

  const myBooksSection = () => {
    setMyBooksToggle(true)
    setmyLikedBooksToggle(false)
    setSearchField("")
  }
  const myLikedBooksSection = () => {
    setMyBooksToggle(false)
    setmyLikedBooksToggle(true)
    setSearchField("")
  }

  useEffect(() => {
    fetchUser()
    setUsername(user)
    setUserFollowers(followers)
    setUserFollowing(following)
}, [router.isReady, user])
// console.log(user)
// console.log(followers)

  const getMyLikedBooks = () => {
      // get books from liked function
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
   
  const fetchMyLikedBooks = async() => {
      const res = await fetch('https://noteshare.live/api/books/liked', requestOptions)
      if (res.status == 200) {
        const MylikedBooks = await res.json();
        setLikedBooks(MylikedBooks)
        // console.log(MylikedBooks)
      } 
      else if (res.status == 401) {
        setSessionExpired(true)
        alert("Error: Session Expired, Please Sign In Again")
      } 
      else {
        alert('failed fetching my liked books')
      }      
    }
    fetchMyLikedBooks()
  }
  
  useEffect(() => {
    getMyLikedBooks()
  }, [])

  const getMyBooks = () => {
      // get books from liked function
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
   
    const fetchMyBooks = async() => {
      const res = await fetch('https://noteshare.live/api/books/mine', requestOptions)
      if (res.status == 200) {
        const MyBooks = await res.json();
        setMyBooks(MyBooks)
        // console.log(MyBooks)
  
      } 
      else if (res.status == 401) {
        setSessionExpired(true)
      } 
      else {
        alert('failed fetching my liked books')
      }      
    }
    fetchMyBooks()
  }
  
  useEffect(() => {
    getMyBooks()
  }, [bookDeleted, bookEdited, router.isReady])

  const handleSearchChange = (event) => {
    setSearchField(event.target.value)
    
}

  useEffect(() => {
    setFilteredLikedBooks(likedBooks.filter(book =>
    book.title.toLowerCase().includes(searchField.toLowerCase())
))
  setFilteredMyBooks(myBooks.filter(book =>
    book.title.toLowerCase().includes(searchField.toLowerCase())
))
}, [likedBooks, myBooks, searchField])

const getPatronRequests = () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('access_token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

const fetchPatronRequests = async() => {
  const res = await fetch('https://noteshare.live/api/patron-requests/', requestOptions)
  if (res.status == 200) {
    const patronRequests = await res.json();
    setPatronRequestList(patronRequests)
    // console.log({patronRequests})
  } 
  else if (res.status == 401) {
    setSessionExpired(true)
  } 
  else {
    alert('failed fetching patron requests')
  }      
}
fetchPatronRequests()
}

useEffect(() => {
  getPatronRequests()
}, [])


const getPatronInvites = () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('access_token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

const fetchPatronRequests = async() => {
  const res = await fetch('https://noteshare.live/api/patron-invites/', requestOptions)
  if (res.status == 200) {
    const patronInvites = await res.json();
    // console.log(patronInvites)
    setPatronInviteList(patronInvites)
    // console.log({patronInvites})

  } 
  else if (res.status == 401) {
    setSessionExpired(true)
  } 
  else {
    alert('failed fetching patron Invites')
  }      
}
fetchPatronRequests()
}

useEffect(() => {
  getPatronInvites()
}, [invitesChanged])

  return (
    <div className={styles.container}>
        <Navbar />
        {localStorage.getItem('access_token') &&
        <>
        
        <div className={styles.textContainer}>
        
          <div className={styles.patronRequests}>
            <PatronRequests requestList={patronRequestList} requestsChanged={requestsChanged} setRequestsChanged={setRequestsChanged} />
          </div>

          <div className={styles.patronInvites}>
            <PatronInvites inviteList={patronInviteList} invitesChanged={invitesChanged} setInvitesChanged={setInvitesChanged} />
          </div>
          <div className={styles.logoAndText}>
            <div className={styles.text}>
              <div className={styles.iconAndHeader}>
                  <Image src="/static/Profile.svg" alt="profile Icon" className={styles.profileIcon} width="100%" height="100%"  layout="responsive"  objectFit="contain"/>
                  <h1>{username}</h1>  
              </div>

              <div className={styles.Followers}>            
                <div className={styles.follow}>
                  <h3>{userFollowers}</h3>
                  <h3>{userFollowing}</h3> 
                  <p>Followers</p>
                  <p>Following </p>         
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className={styles.likedBooksContainer}>
        <div className={styles.options}>
        <div className={styles.option}>
          <h1 style={myLikedBooksToggle ? {color: '#FC7753'}: {color: '#000'}} onClick={myLikedBooksSection}>Liked Books</h1>
        </div>
        <div className={styles.option}>
          <h1 style={myBooksToggle ? {color: '#FC7753'}: {color: '#000'}} onClick={myBooksSection}>My Books</h1>
        </div>
        </div>
          
          <input onChange={handleSearchChange} value={searchField} type="text" className={styles.searchBooks} placeholder="Search for books"/>
          {myLikedBooksToggle &&
            <div>
              <div className={styles.likedBooks}>
              {likedBooks.length > 0 &&
                <Fragment>
                  {
                    filteredLikedBooks.map((book, idx) => {
                      return (
                      <div className={styles.bookContainer} key={idx}>
                        <LibraryCard  filePath={book.thumbnail.split("/backend")[1]} id={book.id} title={book.title} upVotes={book.likes} downVotes={book.dislikes} />
                      </div>
                      )
                      
                    })
                  }             
                </Fragment>
              }

              </div>
              {likedBooks.length <= 0 &&
                <div className={styles.noLikedBooks}>
                    <h1>
                    You Have No Liked Books, <b className={styles.discoverBooks}><Link href={"/explore"}>Discover More Books!</Link></b>
                    </h1>
                    {sessionExpired &&
                    <h1>
                    Error: Session Expired, Please Sign In Again
                    </h1>
                    }
                </div>
              }
              </div>
          }

          {
            myBooksToggle &&
            <div>
              <div className={styles.likedBooks}>
              {filteredMyBooks.length > 0 &&
                <Fragment>
                  {
                    filteredMyBooks.map((book, idx) => {
                      return (
                      <div className={styles.bookContainer} key={idx}>
                        <LibraryCard edited={bookEdited} setEdited={setBookEdited} setDeleted={setBookDeleted} deleted={bookDeleted} description={book.description} myBook={true} id={book.id} filePath={book.thumbnail.split("/backend")[1]} library={book.library} title={book.title} upVotes={book.likes} downVotes={book.dislikes} />
                      </div>
                      )
                      
                    })
                  }             
                </Fragment>
              }

              </div>
              {myBooks.length <= 0 &&
                <div className={styles.noLikedBooks}>
                    <h1>
                      You have created no books at the moment :()
                    </h1>
                </div>
              }
              </div>
          }
          
        </div>   
        </>   
      }
      {!localStorage.getItem('access_token') &&
      <div className={styles.textContainer}>
        <h1 className={styles.text}>Please Sign In To Continue</h1>
      </div>
      }

    </div>
  )
}

export default Profile