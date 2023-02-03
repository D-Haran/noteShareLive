import {useState, useEffect, useContext, Fragment} from 'react';
import Navbar from '../../components/navbar/navbar'
import Image from 'next/image';
import Loading from '../../components/loading/loading'
import styles from '../../styles/library.module.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import LibraryCard from '../../components/library/libraryCard'
import { useRouter } from 'next/router'
import Blur from 'react-blur';
import { motion } from 'framer-motion';
import AuthContext from '../../context/auth'
import Modal from 'react-modal';

const Library = ({chats}) => {
    const router = useRouter()

    const [filteredBooks, setFilteredBooks] = useState([])
    const [books, setBooks] = useState([])
    const [createBookModal, setCreateBookModal] = useState(false)
    const [settingsModal, setSettingsModal] = useState(false)
    const [title, setTitle] = useState('')
    const [ready, setReady] = useState(false)
    const [booksChanged, setBooksChanged] = useState(false)
    const [libraryData, setLibraryData] = useState([])
    const [searchField, setSearchField] = useState('')
    const [showChat, setShowChat] = useState(false)
    const [bookTitle, setBookTitle] = useState("")
    const [bookDescription, setBookDescription] = useState(libraryData.description)
    const [libraryDescription, setLibraryDescription] = useState("")
    const [adminLevel, setAdminLevel] = useState("")
    const [myBook, setMyBook] = useState(false)
    const [bookDeleted, setBookDeleted] = useState(false)
    const [bookEdited, setBookEdited] = useState(false)
    const [libraryChanged, setLibraryChanged] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [editLibraryModal, setEditLibraryModal] = useState(false)
    const [settingsDropDown, setSettingsDropDown] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [invitePatronsModal, setInvitePatronsModal] = useState(false)
    const [confirmLeaveModal, setConfirmLeaveModal] = useState(false)
    const [patrons, setPatrons] = useState('')
    const [isPatron, setIsPatron] = useState(false)
    const [joined, setJoined] = useState(false)
    const [requestSent, setRequestSent] = useState(true)
    const [isPublic, setIsPublic] = useState(true)
    const [users, setUsers] = useState([])
    const [joinMsg, setJoinMsg] = useState("Join Library")

    const [libraryLoaded, setLibraryLoaded] = useState(false)

    const [createBookLoading, setCreateBookLoading] = useState(false)

    const {user, setUser, userId, fetchUser} = useContext(AuthContext)

    const getPatronRequest = async() => {
      if (localStorage.getItem('access_token')) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));

      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      

      const res = await fetch(`https://noteshare.live/api/patron-requests/check-request/${router.query.library}`, requestOptions)
      
      if (res.status == 200) {
        const libraryRequest = await res.json();
        setRequestSent(libraryRequest.result)
        // console.log(libraryRequest)
      }
      else if (res.status == 401) {
        setIsLoggedIn(false)
      }
      else {
        alert('failed fetching request')
      }
    }
    } 

    useEffect(() => {
      if (localStorage.getItem('access_token')) {
        fetchUser()
        setIsLoggedIn(true)
        // console.log(userId)
      }else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }, [router.isReady, userId])

    const animatedComponents = makeAnimated();

    // useEffect(() => {
    //   if (router.isReady) {setReady(true)}
    // }, [router.isReady])

    const handleShowChat = () => {
        setShowChat(!showChat)
    }

    const handleSearchChange = (event) => {
        setSearchField(event.target.value)
    }
    useEffect(() => {
        setFilteredBooks(books.filter(book =>
        book.title.toLowerCase().includes(searchField.toLowerCase())
    ))
    }, [books, searchField])

    const getLibraryDefault = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
    };
          
      const fetchLibrary = async() => {
          const res = await fetch(`https://noteshare.live/api/libraries/default/${router.query.library}`, requestOptions)
        if (res.status == 200) {
          const library = await res.json();
          setLibraryData(library)
          setTitle(library.title)
          setIsPublic(library.public)
          setLibraryDescription(library.description)
          // setReady(true)
        } else {
          alert('failed fetching my liked books')
        }
      }    
        fetchLibrary()
    }

    useEffect(() => {
      if (router.isReady) {
        getPatronRequest()
        getLibraryDefault()
      }
    }, [router.isReady, libraryChanged])

    useEffect(() => {
        if (router.isReady) {
        getAdminLevel()
      }
      
    }, [router.isReady, userId, user, isLoggedIn, joined])

    const getLibraryBooks = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
      const fetchLibrary = async() => {
        const res = await fetch(`https://noteshare.live/api/books/from-library-default/${router.query.library}?limit=50`, requestOptions)
        if (res.status == 200) {
          setReady(true)
          const library = await res.json();
          console.log(library)
          setBooks(library)
          setLibraryLoaded(true)
          
        } else {
          alert('failed fetching books in library')
        }      
      }
      fetchLibrary()
    }

    useEffect(() => {
      if (router.isReady) {
        getLibraryBooks()
      }
    }, [router.isReady, booksChanged, bookDeleted, bookEdited, userId])

    const handleSubmitBook = (e) => {
      setCreateBookLoading(true)
      e.preventDefault()
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
      var formdata = new FormData();
      formdata.append("files", document.getElementById("bookFile").files[0], "/C:/Users/derri/Documents/noteshare_2/frontend/public/PDFs/BigONotation.pdf.pdf");
      formdata.append("book_title", bookTitle);
      formdata.append("book_description", bookDescription);
      formdata.append("library", libraryData.id);

      var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
      };

      const makeBookInLibrary = async() => {
          const res = await fetch("https://noteshare.live/api/books/", requestOptions)
          
          if (res.status == 200) {
            // const BooksInLibrary = await res.json();
            setCreateBookLoading(false)
            setBooksChanged(!booksChanged)
            setCreateBookModal(false)
            console.log("submited")
          } 
          else if (res.status == 401) {
            setIsLoggedIn(false)
            setCreateBookModal(false)
            alert("Error: Session Expired, Please Sign In Again")
            setCreateBookLoading(false)
          } 
          
          else {
            alert('failed creating book')
            console.error()
            setCreateBookLoading(false)
          }
      }
      makeBookInLibrary()
      
  }
    const handleSubmitLibrary = (e) => {
      e.preventDefault()
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));

      var formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", libraryDescription);
      formdata.append("banner", document.getElementById("libraryBanner").files[0], "/C:/Users/derri/Documents/noteshare_2/frontend/public/static/library_banners/lambo_banner 1.png");
      formdata.append("public", "true");

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      const changeLibrarySettings = async() => {
          const res = await fetch(`https://noteshare.live/api/libraries/${libraryData.id}`, requestOptions)
          
          if (res.status == 200) {
            setLibraryChanged(!libraryChanged)
            setSettingsModal(false)
            console.log("submited")
          } 
          else if (res.status == 401) {
            setIsLoggedIn(false)
            setSettingsModal(false)
            alert("Error: Session Expired, Please Sign In Again")
          } 
          else {
            alert('failed editing library')
          }
      }
      changeLibrarySettings()
  }

    const getAdminLevel = async() => {
        if (localStorage.getItem('access_token')) {
          var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('access_token'));

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const res = await fetch(`https://noteshare.live/api/libraries/my-library-admin-level/${router.query.library}`, requestOptions)
        
        if (res.status == 200) {
          const admin_level = await res.json();
          if (admin_level.detail) {
            setIsPatron(false)
            setAdminLevel("")
          } else if (admin_level.admin_level) {
            setAdminLevel(admin_level.admin_level)
            setIsPatron(true)
          } 
          else {
            setIsPatron(true)
          }
        } else if (res.status == 401) {
          // setIsLoggedIn(false)
          console.log("User is not a patron of Library")
        }
      }
    }
  

    useEffect(() => {
          if (adminLevel === "author") {
            setMyBook(true)
          } else if (adminLevel === "librarian") {
            setMyBook(true)
          }  
        }, [adminLevel, userId])

    const deleteLibrary = async() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      const res = await fetch(`https://noteshare.live/api/libraries/${router.query.library}`, requestOptions)
      
      if (res.status == 204) {
        console.log("deleted")
        router.replace("/libraries")
      } 
      else if (res.status == 401) {
        setIsLoggedIn(false)
        alert("Error: Session Expired, Please Sign In Again")
      } 
      else {
        alert('failed deleting library')
      }
    }

    const getUsers = () => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
  
      const fetchUsers = async() => {
        const res = await fetch("https://noteshare.live/api/users/", requestOptions)
        if (res.status == 200) {
          const Patrons = await res.json();
          setUsers(Patrons)
          // console.log(Patrons)
  
        } else {
          alert('failed fetching users')
        }      
      }
      fetchUsers()
    }
  
    useEffect(() => {
      getUsers()
    }, [])

    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        color: '#fff',
        backgroundColor: '#000',
        padding: 20,
      }),
    
      control: (_, { selectProps: { width }}) => ({
        
      }),
    
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
    
        return { ...provided, opacity, transition };
      }
    }

    const getPatrons = (selectedOptions) => {
      setPatrons(selectedOptions)
      // console.log(patrons)
    }

    const invitePatronsFunction = async(patron_id) => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
      myHeaders.append("Content-Type", "application/json");

      
    var raw = JSON.stringify({
      "library_id": libraryData.id,
      "patron_id": patron_id,
      "admin_level": "reader"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

      const res = await fetch(`https://noteshare.live/api/patron-invites/`, requestOptions)
      
      if (res.status == 200) {
        console.log("invites sent")
      } 
      if (res.status == 401) {
        alert("Error: Session Expired, Please Sign In Again")
      } 
      else {
        alert('failed inviting members')
      }
    }   
    
    const invitePatrons = (e) => {
      e.preventDefault()
      patrons.map((patron) => {
        invitePatronsFunction(patron.id)
      })    
    }

const createPatronRequest = async() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
      myHeaders.append("Content-Type", "application/json");

      
      var raw = JSON.stringify({
        "library_id": libraryData.id,
        "admin_level": "author"
      });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

      const res = await fetch(`https://noteshare.live/api/patron-requests/`, requestOptions)
      
      if (res.status == 201) {
        console.log("request sent")
      } 
      else if (res.status == 409) {
        console.log("already sent patron request")
      }
      else if (res.status == 401) {
        setIsLoggedIn(false)
        alert("Error: Session Expired, Please Sign In Again")
      }
      else {
        alert('failed sending request')
      }
    } 

    const leaveLibrary = async() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };
      

      const res = await fetch(`https://noteshare.live/api/patrons/${libraryData.id}`, requestOptions)
      
      if (res.status == 204) {
        router.replace("/libraries")
        console.log("request sent")
      } 
      else if (res.status == 409) {
        console.log("already left library")
      }
      else if (res.status == 401) {
        setIsLoggedIn(false)
        alert("Error: Session Expired, Please Sign In Again")
      }
      else {
        alert('failed leaving library')
      }
    }

    const joinLibrary = async() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "library_id": libraryData.id,
        "admin_level": "reader"
      });
  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      const res = await fetch("https://noteshare.live/api/patron-requests/", requestOptions)
      if (res.status == 201) {
        setJoinMsg("Request Sent")
        setJoined(!joined)
      } 
      else if (res.status == 409) {
        return null
      }
      else if (res.status == 401) {
        alert("Error: Session Expired, Please Sign In Again")
        setIsLoggedIn(false)
      }
      else {
        alert('failed joining library')
      }

      
  }

  const fileUpdated = () => {
    let str = document.getElementById("bookFile").files[0]?.name;
    str = str.substring(0, str.length - 4).split('_').join(' ');
    if (document.getElementById("title").value.length == 0) {
      document.getElementById("title").value = str
    }
    
  }
const libraryStyle = {
        background:`no-repeat center url('${String(libraryData.banner).split("/backend")[1]}')`,
        width: '100vw',
        backgroundPosition: 'center',
        MozBackgroundSize: "cover",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflowX: 'hidden'
    }
    const scaleUp = {scale: 1.1};
    const scaleDown = {scale: 0.95}

    return (
      <div>
      {libraryLoaded && 
        <div>
          <Blur img={books.length >= 0 ? String(libraryData.banner).split("/backend")[1] : "/files/banners/154a4253-4f43-4154-89fb-6aa7c8357cc4.jpeg"}  blurRadius={50} shouldResize enableStyles style={{height: '100%'}}>
          <div>
              <Navbar />
              <div className={styles.container} style={libraryStyle}>
              {isLoggedIn &&
              <div>
                {adminLevel === "author" &&
                          <div className={styles.librarianSettingsWrapper}>
                              <motion.h1 whileHover={{ ...scaleUp }} onClick={() => setCreateBookModal(true)} whileTap={{ ...scaleDown }} className={styles.addBook}>+</motion.h1>
                              <Image width="50%" height="50%"  layout="responsive"  objectFit="contain" src={'/static/invite.svg'} className={styles.inviteIcon} onClick={() => setInvitePatronsModal(!settingsDropDown)} />
                              <Image width="50%" height="50%"  layout="responsive"  objectFit="contain" src={'/static/leaveLibrary.svg'} className={styles.inviteIcon} onClick={() => setConfirmLeaveModal(!confirmLeaveModal)}  />
                          </div>
                      }
                { adminLevel === "librarian" &&
                <div className={styles.librarianSettingsWrapper}>
                  <Image width="100%" height="100%"  layout="responsive"  objectFit="contain" src={'/static/settings.svg'} className={styles.settingsIcon} onClick={() => setSettingsDropDown(!settingsDropDown)} />
                  <Image width="50%" height="50%"  layout="responsive"  objectFit="contain" src={'/static/invite.svg'} className={styles.inviteIcon} onClick={() => setInvitePatronsModal(!settingsDropDown)} />
                  <div onClick={() => setCreateBookModal(true)}>
                      <motion.h1 whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }} className={styles.addBook}>+</motion.h1>
                  </div>
                </div>
                }
                {adminLevel === "reader" &&
                <div  className={styles.librarianSettingsWrapper}>
                {!requestSent && 
                  <Image width="50%" height="50%"  layout="responsive"  objectFit="contain" src={'/static/authorAccount.svg'} className={styles.requestIcon} onClick={() => {createPatronRequest(); setRequestSent(true)}} />
                }
                    <motion.h1 onClick={() => setCreateBookModal(true)} whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }} className={styles.addBook}>+</motion.h1>
                    <Image width="50%" height="50%"  layout="responsive"  objectFit="contain" src={'/static/leaveLibrary.svg'} className={styles.inviteIcon} onClick={() => setConfirmLeaveModal(!confirmLeaveModal)} />
                </div> 
                }
                {adminLevel === "" &&
                <div className={styles.notPatronSettingsWrapper}>
                  <div>
                  {joined &&
                    <h2 className={styles.notPatronJoined}>{joinMsg}</h2>
                  }
                  {!joined &&
                    <h2 className={styles.notPatronJoin} onClick={joinLibrary}>{joinMsg}</h2>
                  }
                    
                  </div>
                </div> 
                }
              </div>
            }

            {settingsDropDown &&
              <motion.div initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0, 0.71, 0.2, 1.01]
              }} className={styles.options}>
              <div onClick={() => {setConfirmDelete(true); setSettingsDropDown(false)}} className={styles.option}>
                <p>Delete</p>
              </div>
              <div onClick={() => {setEditLibraryModal(true); setSettingsDropDown(false)}} className={styles.option}>
                <p>Edit</p>
              </div>
            </motion.div>
            }
                    
              <Modal isOpen={createBookModal} 
              closeTimeoutMS={500}
              onRequestClose={() => setCreateBookModal(false)}
              ariaHideApp={false}
              style={
                  {
                      overlay: {
                          color: '#fff',
                          background: 'rgba( 0, 0, 0, 0.0 )',
                          backdropFilter: 'blur(2px)',
                          zIndex: '900'
                      },
                      content: {
                          width: '40%',
                          justifyContent: 'center',
                          margin: 'auto',
                          height: "90vh",
                          overflowX: "hidden",
                          color: '#000',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 0,
                          borderRadius: '2vw',
                          zIndex: '900'
                      }}}>
                  <form className={styles.formContainer} onSubmit={handleSubmitBook}>
                      <h1>Create a Book in {libraryData.title}</h1>
                      <label>Title</label>
                      <input className={styles.input} id="title" placeholder="Type Here" required onChange={(e) => {setBookTitle(e.target.value)}} />
                      <label>Description</label>
                      <input className={styles.input} id="description" placeholder="Type Here" required onChange={(e) => {setBookDescription(e.target.value)}} />
                      <input className={styles.input} type="file" onChange={fileUpdated} id="bookFile" required multiple />
                      {!createBookLoading &&
                        <motion.button type="submit" className={styles.submitButton}>Create Book</motion.button>
                      }
                      {createBookLoading &&
                        <motion.button className={styles.submitButton} disabled>Writing...</motion.button>
                      }
                  </form>
              </Modal>
              <Modal isOpen={confirmDelete} 
              closeTimeoutMS={500}
              onRequestClose={() => setConfirmDelete(false)}
              ariaHideApp={false}
              style={
                  {
                      overlay: {
                          color: '#fff',
                          background: 'rgba( 0, 0, 0, 0.0 )',
                          backdropFilter: 'blur(2px)',
                          zIndex: '900'
                      },
                      content: {
                          width: '40%',
                          justifyContent: 'center',
                          margin: 'auto',
                          height: "20vh",
                          overflowX: "hidden",
                          color: '#000',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 0,
                          borderRadius: '2vw',
                          zIndex: '900'
                      }}}>
                    <div className={styles.confirmDelete}>
                      <h2>Are you sure you want to delete {title}</h2>
                      <button onClick={deleteLibrary} className={styles.delete}>Delete</button>
                      <button className={styles.cancel} onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
              </Modal>
              <Modal isOpen={confirmLeaveModal} 
              closeTimeoutMS={500}
              onRequestClose={() => setConfirmLeaveModal(false)}
              ariaHideApp={false}
              style={
                  {
                      overlay: {
                          color: '#fff',
                          background: 'rgba( 0, 0, 0, 0.0 )',
                          backdropFilter: 'blur(2px)',
                          zIndex: '900'
                      },
                      content: {
                          width: '40%',
                          justifyContent: 'center',
                          margin: 'auto',
                          height: "20vh",
                          overflowX: "hidden",
                          color: '#000',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 0,
                          borderRadius: '2vw',
                          zIndex: '900'
                      }}}>
                    <div className={styles.confirmDelete}>
                      <h2>Are you sure you want to leave {title}</h2>
                      <button onClick={leaveLibrary} className={styles.delete}>Leave</button>
                      <button className={styles.cancel} onClick={() => setConfirmLeaveModal(false)}>Cancel</button>
                    </div>
              </Modal>
              <Modal isOpen={invitePatronsModal} 
              closeTimeoutMS={500}
              onRequestClose={() => setInvitePatronsModal(false)}
              ariaHideApp={false}
              style={
                  {
                      overlay: {
                          color: '#fff',
                          background: 'rgba( 0, 0, 0, 0.0 )',
                          backdropFilter: 'blur(2px)',
                          zIndex: '900'
                      },
                      content: {
                          width: '40%',
                          justifyContent: 'center',
                          margin: 'auto',
                          height: "90vh",
                          overflowX: "hidden",
                          color: '#000',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 0,
                          borderRadius: '2vw',
                          zIndex: '900'
                      }}}>
                      <form className={styles.invitePatronsWrapper}>
                      <h2>Add Patrons</h2>  
                    <label htmlFor="patrons">Patrons</label>
                    <Select closeMenuOnSelect={false}
                            components={animatedComponents}
                            getOptionLabel={option => option.username}
                            getOptionValue={option => option.id}
                            options={users}
                            onChange={(getPatrons)}
                            value={patrons}
                            styles={customStyles}
                            isMulti  type="text" name="description" placeholder="Usernames"/>  
                      <button onClick={invitePatrons}>Invite {patrons.length} members</button>
                    </form>
              </Modal>
                  <div className={styles.titleText}>
                                    
                    <div className={styles.description}>
                          <h1>Welcome to {title}</h1>
                    </div>

                    <Modal isOpen={editLibraryModal} 
                    closeTimeoutMS={500}
                    onRequestClose={() => setEditLibraryModal(false)}
                    ariaHideApp={false}
                    style={
                        {
                            overlay: {
                                color: '#fff',
                                background: 'rgba( 0, 0, 0, 0.0 )',
                                backdropFilter: 'blur(2px)',
                                zIndex: '900'
                            },
                            content: {
                                width: '40%',
                                justifyContent: 'center',
                                margin: 'auto',
                                height: "90vh",
                                overflowX: "hidden",
                                color: '#000',
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 0,
                                borderRadius: '2vw',
                                zIndex: '900'
                            }}}>
                        <form className={styles.formContainer} onSubmit={handleSubmitLibrary}>
                            <h1>Edit {libraryData.title}</h1>
                            <label>Title</label>
                            <input className={styles.input} id="libraryTitle" placeholder="Type Here" defaultValue={title} required onChange={(e) => {setTitle(e.target.value)}} />
                            <label>Description</label>
                            <input className={styles.input} id="libraryDescription" placeholder="Type Here" defaultValue={libraryDescription} required onChange={(e) => {setLibraryDescription(e.target.value)}} />
                            <label>Banner</label>
                            <input className={styles.input} type="file" id="libraryBanner" required />
                            <motion.button type="submit" className={styles.submitButton}>Edit Library</motion.button>
                        </form>
                      </Modal>
                                  
                    <p className={styles.libraryDescription}>{libraryData.description}</p>
                      <input onChange={handleSearchChange} type="text" className={styles.searchBooks} placeholder="Search for books"/>
                      
                    {/*<div className={styles.expand}>
                          <Image  src='/static/CommentsIcon.png' onClick={handleShowChat} alt='Library Chat' width={20} height={20} />
                      </div> */}
                    
                  </div>
                    <div>
                    {isPublic &&
                        <div className={styles.bookContainer}>
                          {
                            filteredBooks.map((book, idx) => {
                              // console.log(book.id)
                                return (
                                  <div key={idx} >
                                    <LibraryCard edited={bookEdited} setEdited={setBookEdited} setDeleted={setBookDeleted} deleted={bookDeleted} myBook={ userId === book.owner_id ? true : myBook === true ? true : false} id={book.id} filePath={book.thumbnail.split("/backend")[1]} library={book.library} description={book.description} title={book.title} downVotes={book.dislikes} upVotes={book.likes}/>
                                  </div>
                                        
                                )
                              })
                            }  
                        </div>
                      }
                    {isPublic == false &&
                      <div className={styles.bookContainer}>
                      {isPatron &&
                        <div>
                          {
                            filteredBooks.map((book, idx) => {
                              // console.log(book.id)
                                return (
                                  <div key={idx} >
                                    <LibraryCard edited={bookEdited} setEdited={setBookEdited} setDeleted={setBookDeleted} deleted={bookDeleted} myBook={ userId === book.owner_id ? true : myBook === true ? true : false} id={book.id} filePath={book.thumbnail.split("/backend")[1]} library={book.library} description={book.description} title={book.title} downVotes={book.dislikes} upVotes={book.likes}/>
                                  </div>
                                        
                                )
                              })
                            }  
                        </div>
                      }
                      {isPatron == false &&
                        <div className={styles.notPatron}>
                          <h1 className={styles.notPatronHeader}>You are not a patron of this private library, please send a patron request to view books in library</h1>
                        </div>
                      }
                      </div>
                      }
                                    
                    </div>
              </div>            
              
              {/*{
                  showChat &&
              <div className={styles.chatWrapper}>
                  <LibraryChat chats={chats} libraryName={router.query.library} closeChat={setShowChat} />
              </div>                
              } */}


          </div>
              </Blur>
        </div>
      
      }

      {!libraryLoaded &&
        <Loading />
      }
      </div>
      
    
    )
}

// export async function getServerSideProps() {
//     const url = "http://localhost:3000/api/chats"
//     const res = await fetch(url);
//     const chats = await res.json();
//     console.log(chats)
//     return { props: {chats} }
//   }

export default Library