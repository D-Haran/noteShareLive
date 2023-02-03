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
  console.log(router.query.profile)

  const {userId, followers, following} = useContext(AuthContext)

  console.log({userId})

  useEffect(() => {
    if (router.isReady) {
        if (userId == router.query.profile) {
        router.replace('/profiles/myprofile')
      }
    }
  }, [profileId, userId, router.isReady])

  const [filteredUserBooks, setFilteredUserBooks] = useState(myBooks)
  const [userBooks, setUserbooks] = useState([])
  const [searchField, setSearchField] = useState('')
  const [profileId, setProfileId] = useState(null)
  const [username, setUsername] = useState('')
  const [followed, setFollowed]= useState(false)
  const [userFollowers, setUserFollowers] = useState('')
  const [userFollowing, setUserFollowing] = useState('')
  const [bookDeleted, setBookDeleted] = useState(false)
  const [bookEdited, setBookEdited] = useState(false)

  const [sessionExpired, setSessionExpired] = useState(false)

  const [myBooks, setMyBooks] = useState([])

  const fetchUser = async() => {
      // get books from liked function
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
   
      const res = await fetch(`https://noteshare.live/api/users/${router.query.profile}`, requestOptions)
      if (res.status == 200) {
        const user = await res.json();
        setProfileId(user.id)
        console.log('profile', user.id)
        setUsername(user.username)
        setUserFollowers(user.followers)
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
  
  useEffect(() => {
    fetchUser()
  }, [followed])

  const getUserBooks = async() => {
      // get books from liked function
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
   
      const res = await fetch(`https://noteshare.live/api/books/user-public-books-default/${router.query.profile}`, requestOptions)
      if (res.status == 200) {
        const MyBooks = await res.json();
        setFilteredUserBooks(MyBooks)
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
  
  useEffect(() => {
    if (router.isReady) {
      getUserBooks()
    }
  }, [router.isReady])

  const handleSearchChange = (event) => {
    setSearchField(event.target.value)
    
}

const followUser = async() => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('access_token'));

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const res = await fetch(`https://noteshare.live/api/followers/${router.query.profile}`, requestOptions)
  if (res.status == 201) {
    setFollowed(!followed)
    console.log("followed")
  } 
  else if (res.status == 401) {
    console.log("Error: Session Expired, Please Sign In Again")
  }
  else if (res.status == 409) {
    const MyBooks = await res.json();
    unfollowUser()
    console.log(MyBooks.detail)
  } 
  else {
    console.log('failed following user')
  }
}
const unfollowUser = async() => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('access_token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  const res = await fetch(`https://noteshare.live/api/followers/${router.query.profile}`, requestOptions)
  if (res.status == 204) {
    setFollowed(!followed)
    console.log("unfollowed")
  } 
  else if (res.status == 401) {
    console.log("Error: Session Expired, Please Sign In Again")
  }
  else if (res.status == 409) {
    const MyBooks = await res.json();
    console.log(MyBooks.detail)
  } 
  else {
    console.log('failed Unfollowing user')
  }
}

  useEffect(() => {
    setFilteredUserBooks(myBooks.filter(book =>
    book.title.toLowerCase().includes(searchField.toLowerCase())
))
}, [userBooks, searchField])

  return (
    <div className={styles.container}>
        <Navbar />
        <>
        
        <div className={styles.textContainer}>
          <div className={styles.logoAndText}>
            <div className={styles.text}>
              <div className={styles.iconAndHeader}>
                  <Image src="/static/Profile.svg" alt="profile Icon" className={styles.profileIcon} width={100} height={100} />
                  <h1>{username}</h1>  
              </div>

              <div className={styles.Followers}>            
                <div className={styles.follow}>
                  <h3>{userFollowers}</h3>
                  <h3>{userFollowing}</h3> 
                  <p>Followers</p>
                  {localStorage.getItem('access_token') &&
                  <p className={styles.followUser} onClick={followUser}>Follow</p>  
                }
                         
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className={styles.likedBooksContainer}>
        <div className={styles.options}>
        <div className={styles.option}>
          <h1>{username}&apos;s Books</h1>
        </div>
        </div>
          
          <input onChange={handleSearchChange} type="text" className={styles.searchBooks} placeholder="Search for books"/>
            <div>

              {myBooks.length <= 0 &&
                <div className={styles.noLikedBooks}>
                    <h1>
                      User Hasn&apos;t Created Any Books
                    </h1>
                    {sessionExpired &&
                    <h1>
                    Error: Session Expired, Please Sign In Again
                    </h1>
                    }
                </div>
              }
              </div>

            <div>
              <div className={styles.likedBooks}>
              {myBooks.length > 0 &&
                <Fragment>
                  {
                    filteredUserBooks.map((book, idx) => {
                      return (
                      <div className={styles.bookContainer} key={idx}>
                        <LibraryCard description={book.description} id={book.id} filePath={book.thumbnail.split("/backend")[1]} library={book.library} title={book.title} upVotes={book.likes} downVotes={book.dislikes} />
                      </div>
                      )
                      
                    })
                  }             
                </Fragment>
              }

              </div>
              </div>
          
        </div>   
        </>   

    </div>
  )
}

export default Profile