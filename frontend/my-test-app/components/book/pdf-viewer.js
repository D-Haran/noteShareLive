import { useState, useEffect, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
import Image from 'next/image'
import Comments from '../comments/comments'
// import { Worker, Viewer } from '@react-pdf-viewer/core';

import { motion } from "framer-motion";
import {useRouter} from 'next/router';
import AuthContext from '../../context/auth'
import styles from './pdf-viewer.module.css'
import Modal from "react-modal";
import Link from "next/link";



const PDFViewer = (props) => {
  
  const {bookSet=[], selectedBook=1, dataExport} = props

  const {user, setUser, fetchUser} = useContext(AuthContext)

  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [file, setFile] = useState('');
  const [index, setIndex] = useState(0);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [widthGreater, setWidthGreater] = useState(false);

  const [description, setDescription] = useState('')
  const [title, setTitle] = useState("")
  const [owner, setOwner] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [library, setLibrary] = useState('')
  const [libId, setLibId] = useState(null)

  const [showComments, setShowComments] = useState(true)
  const [commentCount, setCommentCount] = useState(0)
  const [comments, setComments] = useState([])

  const [showExpanded, setShowExpanded] = useState(false)

  const [upVotes, setupVotes] = useState(0)
  const [downVotes, setdownVotes] = useState(0)
  const [upVote, setUpVote] = useState(false)
  const [downVote, setDownVote] = useState(false) 
  const [voted, setVoted] = useState(false)

  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentsFetched, setCommentsFetched] = useState(false)

  const [bookId, setBookId] = useState(null)

  const [booksViewed, setBooksViewed] = useState([])
  const [randomNum, setRandomNum] = useState(null)

  const showExpandedPDF = () => {
    setShowExpanded(true)
  }

  function generateRandom(maxLimit = 100){
    let rand = Math.random() * maxLimit;
    console.log(Math.floor(rand));
    setRandomNum(Math.floor(rand));
  }

useEffect(() => {
  // console.log("general")
  if (!router.isReady) return;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js`;
  const id= parseInt(router.query.title)
  // if (booksViewed.includes(id)) {
  //   return
  // }else {
  //   booksViewed.push(id)
  // }
  
  console.log(booksViewed)
  const elementPos = bookSet.map(function(book) {return book.id; }).indexOf(id)
  setIndex(elementPos)
  bookSet.map(function(book) {
    if (book.id === parseInt(id)) {
      setLibId(book.library_id)

      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem('access_token'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      if (localStorage.getItem('access_token')) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('access_token'));
    
        var requestOptionsComments = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        setIsLoggedIn(true)
        
      const fetchComments = async() => {
        const res = await fetch(`https://noteshare.live/api/comments/${book.id}`, requestOptionsComments)
        if (res.status == 200) {
          const commentsOnBook = await res.json();
          setComments(commentsOnBook)
          setCommentCount(commentsOnBook.length)
        }
        else if (res.status == 401) {
          var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          const fetchComments = async() => {
            const res = await fetch(`https://noteshare.live/api/comments/default/${book.id}`, requestOptions)
            if (res.status == 200) {
              const commentsOnBook = await res.json();
              console.log("default")
              setComments(commentsOnBook)
              setCommentCount(commentsOnBook.length)
            }}
          fetchComments()
        }
      }
      fetchComments()
      
      } else {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const fetchComments = async() => {
          const res = await fetch(`https://noteshare.live/api/comments/default/${book.id}`, requestOptions)
          if (res.status == 200) {
            const commentsOnBook = await res.json();
            setComments(commentsOnBook)
            setCommentCount(commentsOnBook.length)
          }}
          fetchComments()
      }
      setBookId(book.id)
      setFile(book.file.split("/backend")[1])
      setOwner(book.owner)
      setOwnerId(book.owner_id)
      setTitle(book.title)
      setComments(book.comments)
      setLibrary(book.library)
      setDescription(book.description)
      setCommentsLoaded(false)
      // setupVotes(book.likes)
      // setdownVotes(book.dislikes)
      // setUpVote(book.liked)
      // setDownVote(book.disliked)
    } 
  })
}, [router.query.title, router.isReady, bookSet])

    const scaleUp = {scale: 1.1};
    const scaleDown = {scale: 0.95}
    
    
    const handleShowComments = () => {
        setShowComments(!showComments)
      }

      function BookChangeNext() {
        if(index !== bookSet.length - 1) {
          setIndex(index => index + 1)
          const myFile = bookSet[index + 1]
          const pdf = myFile['file'].split("/backend")[1]
          const myDescription = myFile["description"]
          const bookLibrary = myFile['library']
          const myOwner = myFile["owner"]
          const myOwnerId = myFile["owner_id"]
          const myUpVotes = myFile["likes"]
          const myDownVotes = myFile["dislikes"]
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              title: myFile.id
          }
        })
        // setupVotes(myUpVotes)
        setLibrary(bookLibrary)
        setDescription(myDescription)
        // setdownVotes(myDownVotes)
        setOwner(myOwner) 
        setOwnerId(myOwnerId)
        setFile(pdf) 
        setPageNumber(1)
        } else {
          return
        } 
    }    
    
    function BookChangePrevious() {
        if(index !== 0) {   
          setIndex(index => index - 1)
          // console.log("bookChange: ", index)
          const myFile = bookSet[index - 1]
          const pdf = myFile['file'].split("/backend")[1]
          const myDescription = myFile["description"]
          const bookLibrary = myFile['library']
          const myOwner = myFile["owner"]
          const myOwnerId = myFile["owner_id"]
          const myUpVotes = myFile["likes"]
          const myDownVotes = myFile["dislikes"]
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              title: myFile.id
          }
        })
        // setupVotes(myUpVotes)
        setLibrary(bookLibrary)
        setDescription(myDescription)
        // setdownVotes(myDownVotes)
        setOwner(myOwner) 
        setFile(pdf) 
        setOwnerId(myOwnerId)
        setPageNumber(1)
        } else {
          return
        }

    }
useEffect(() => {
      

if (isLoggedIn) {
    const getVotesForBook = () => {
  var myHeaders = new Headers();
myHeaders.append("Authorization", localStorage.getItem('access_token'));      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      const fetchVotes = async() => {
        const res = await fetch(`https://noteshare.live/api/vote-book/${bookId}`, requestOptions)
        if (res.status == 200) {
          const votesOnBook = await res.json();
          setUpVote(votesOnBook.liked)
          setDownVote(votesOnBook.disliked)
          setupVotes(votesOnBook.likes)
          setdownVotes(votesOnBook.dislikes)
        }
        else if (res.status == 401) {
          setIsLoggedIn(false)
        }
      }
      fetchVotes()
    }
    getVotesForBook() 
} else {
  const getVotesForBook = () => {    
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
  
      const fetchVotes = async() => {
        if (bookId === null) return null;
        const res = await fetch(`https://noteshare.live/api/vote-book/default/${bookId}`, requestOptions)
        if (res.status == 200) {
          const votesOnBook = await res.json();
          setupVotes(votesOnBook.likes)
          setdownVotes(votesOnBook.dislikes)
        }}
      fetchVotes()
    }
      if (router.isReady) {
        getVotesForBook()
      }
}
      
}, [bookId, upVote, downVote]) 

    function debounce(fn, ms) {
      let timer
      return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
          timer = null
          fn.apply(this, arguments)
        }, ms)
      };
    }

    // ####################    VOTING   ######################################### //
    const handleUpVote = () => {
      if (localStorage.getItem('access_token')) {
        if (upVote) {
          console.log("already liked book")
          setUpVote(false)
          setDownVote(false)
          var myHeaders = new Headers();
          myHeaders.append("Authorization", localStorage.getItem('access_token'));
          myHeaders.append("Content-Type", "application/json");
      
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
              "dir": 0,
              "book_id": parseInt(bookId)
            }),
            redirect: 'follow'
          };
      
        const updateUpVote = async() => {
          const res = await fetch('https://noteshare.live/api/vote-book/', requestOptions)
          if (res.status == 200) {
            setVoted(!voted)
            setUpVote(false)
            setDownVote(false)
            // console.log({upVote})
      
          }
          else if (res.status == 401) {
            return
      
          } 
          else if (res.status == 409) {
            return
      
          } 
          else {
            alert('failed unliking book with id ', bookId)
          }      
        }
        updateUpVote()        
      } else {
        // console.log("liking in process...")
        setUpVote(true)
        setDownVote(false)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('access_token'));
        myHeaders.append("Content-Type", "application/json");
    
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "dir": 1,
            "book_id": parseInt(bookId)
          }),
          redirect: 'follow'
        };
    
      const updateUpVote = async() => {
        const res = await fetch('https://noteshare.live/api/vote-book/', requestOptions)
        if (res.status == 200) {            
          setVoted(!voted)
          setUpVote(true)
          setDownVote(false)
          console.log({upVote}, ": Liked book")
    
        } 
        else if (res.status == 401) {            
          return
        } 
        else {
          alert('failed liking book with id ', bookId)
        }      
      }
      updateUpVote()   
      }
      } else {
        return
      }
        // get all public
        
    }

    const handleDownVote = () => {
      if (localStorage.getItem('access_token')) {
      // if user has already downvoted, unlike the book
      if (downVote) {
        // console.log("already liked book")
        setUpVote(false)
        setDownVote(false)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('access_token'));
        myHeaders.append("Content-Type", "application/json");
    
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "dir": 0,
            "book_id": parseInt(bookId)
          }),
          redirect: 'follow'
        };
    
      const updateDownVote = async() => {
        const res = await fetch('https://noteshare.live/api/vote-book/', requestOptions)
        if (res.status == 200) {
          setVoted(!voted)
          setUpVote(false)
          setDownVote(false)
          // console.log({upVote}, ": deleted vote")
    
        }
        else if (res.status == 401) {
          return
    
        } else {
          console.log('failed liking book with id ', bookId, "Already liked 409 Error")
        }      
      }
      updateDownVote()          
    } 
    // otherwise, if they haven't liked the book, then dislike the book
    else {
        setUpVote(false)
        setDownVote(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('access_token'));
        myHeaders.append("Content-Type", "application/json");
    
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "dir": -1,
            "book_id": parseInt(bookId)
          }),
          redirect: 'follow'
        };
    
        const updateDownVote = async() => {
          const res = await fetch('https://noteshare.live/api/vote-book/', requestOptions)
          if (res.status == 200) {
            setVoted(!voted)
            setUpVote(false)
            setDownVote(true)
            
            console.log({downVote}, "downvoted")
      
          }
          else if (res.status == 401) {
            return
          } else {
            alert('failed disliking book with id ', bookId)
          }      
        }
      updateDownVote()   
      }
      } else {
        return
      }
      
    }

    // ####################    ######  ########################################## //

    const nextPageHandler = () => {
      if(pageNumber === numPages) {
        document.addEventListener("keydown", detectKeyDown, true);
          return
      }else {
          setPageNumber(pageNumber + 1)        
      }
    }
    useEffect(() => {
      document.addEventListener("keydown", detectKeyDown, true);
    }, [index, pageNumber, router.query.title])

    const detectKeyDown = (e) => {
        if (e.key == "ArrowRight") {
          document.removeEventListener("keydown", detectKeyDown, true);
          e.preventDefault();
          nextPageHandler();
        }
        else if (e.key == "ArrowLeft") {
          document.removeEventListener("keydown", detectKeyDown, true);
          e.preventDefault();
          previousPageHandler();
      }
        else if (e.key == "ArrowUp") {
          document.removeEventListener("keydown", detectKeyDown, true);
          e.preventDefault();
          BookChangePrevious();
      }
        else if (e.key == "ArrowDown") {
          document.removeEventListener("keydown", detectKeyDown, true);
          e.preventDefault();
          BookChangeNext();
      }
      
  }

    const previousPageHandler = () => {
      if(pageNumber == 1) {
        document.addEventListener("keydown", detectKeyDown, true);
          return
      }else {
          setPageNumber(pageNumber - 1)        
      }
    }

    const handleWindowSizeChange = () => {
      setPageHeight(window.innerHeight);
    };

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
        setNumPages(nextNumPages);  
        const debouncedHandleResize = debounce(async function handleResize() {
          if (pageHeight > h) {
          console.log("Height is greater than ")
        }  
        const h = window.innerHeight;
        const w = window.innerWidth;
        const pageHeightAlg = 0.62 * h;
        const pageWidthAlg = 0.32 * w;
        if (pageWidth > pageHeight){
          setWidthGreater(true)
          setPageWidth(pageWidthAlg);
        } else {
          setPageHeight(pageHeightAlg);
        }
        
        
      }, 250)
      debouncedHandleResize()
    }    

  useEffect(()=> {
    console.log("resized")
    const debouncedHandleResize = debounce(function handleResize() {
      const h = window.innerHeight;
      const pageHeightAlg = 0.62 * h;
      setPageHeight(pageHeightAlg)}, 250)

    window.addEventListener('resize', debouncedHandleResize)
    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
}, [])

  const searchPage = (event) => {
    const inputVal = document.getElementById("setPageNum").value
    if(event.key === "." || event.key === "-"){
      event.preventDefault();
    }
    else if(event.key === 'Enter') {
      if(parseInt(inputVal) > numPages) {
        document.getElementById("setPageNum").value = ""
      }else if(parseInt(inputVal) <= 0) {
        document.getElementById("setPageNum").value = ""
      }
      else {
          setPageNumber(parseInt(inputVal))        
      } 
      document.getElementById("setPageNum").value = ""
    }
  }

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol : "0";
  }

  // #################### MODAL EXIT #######################
  // <h1 onClick={() => setShowExpanded(!showExpanded)} style={{cursor: 'pointer', position: 'absolute', right: 0, top: -20, color: '#000'}}>x</h1>
 // ########################################################
  
      // <div className={styles.bookSummaryContainer}>
      // <h1>Book Summary</h1>
      // <p>Nisi Lorem eiusmod non excepteur aliquip ullamco nisi qui Lorem veniam quis. Velit nisi deserunt dolor deserunt adipisicing commodo pariatur aliquip eiusmod ullamco laborum officia consectetur dolor. Magna dolor voluptate est adipisicing duis duis do laborum elit. Adipisicing labore aute do officia. Ipsum aute culpa do excepteur laborum consectetur labore sunt nostrud anim. Occaecat amet ullamco culpa nisi Lorem pariatur in voluptate.Incididunt nostrud esse exercitation qui magna incididunt consectetur tempor id nulla do voluptate. Laborum laborum ut aliqua dolor culpa aute mollit veniam officia veniam reprehenderit nostrud anim consequat. Esse pariatur cillum laborum irure duis dolore sint pariatur sit fugiat. Culpa pariatur tempor excepteur velit magna excepteur. Veniam velit ipsum dolore occaecat elit duis pariatur minim ullamco magna ipsum in. Minim ex aute elit quis ad mollit incididunt reprehenderit. Sunt proident fugiat sunt aute et proident proident nisi in dolor cupidatat.</p>
      // </div> 
  return (
    <div className={styles.container}>
      <div className={styles.col1}>
      <div className={styles.grid}>

        <div className={styles.votingButtons}>
          <h3>{nFormatter(upVotes, 2)}</h3>            
          <div className={upVote ? styles.Voted: styles.Vote} onClick={handleUpVote}>
          <Image src="/static/spearUp.svg" width={20} height={20} alt="upVote" />      
          </div>
          <h3>{nFormatter(downVotes, 2)}</h3>             
          <div className={downVote ? styles.Voted: styles.Vote} onClick={handleDownVote}>
          <Image src="/static/spearDown.svg" width={20} height={20} alt="downVote" /> 
          </div>
        </div>
        <div>
        <div className={styles.book}>
        <div className={styles.page}>
            <Document file={file} onLoadError={console.log}  onSourceError={console.log} onLoadSuccess={onDocumentLoadSuccess}>
            <motion.div initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01]
            }}>
              <Page className={styles.bookPage} pageNumber={pageNumber} {...(widthGreater ? {width:pageWidth} : {height:pageHeight})}  wrap={false} />  
             </motion.div>  
            </Document>   
                  
        </div>
          <div className={styles.bookDetailsWrapper}>
              <div className={styles.bookDetails}>
                <div className={styles.bookDetailsHeader}>
                  <div>
                    <Link href={`/libraries/${libId}`}>
                    <a>
                      <b>
                          <h3  className={styles.libraryLink}>{library}</h3>
                        </b> 
                    </a>
                      
                    </Link>
                    <Link href={`/profiles/${ownerId}`}>
                      <h4 className={styles.libraryLink}>{owner}</h4>
                    </Link>
                    
                  </div>
                  <div className={styles.bookDetailsText}>
                    <p>{description}</p>
                  </div>            
                </div>          
              </div>          
          </div>  
              
      </div> 
      
      
          <div className={styles.navigation}>
            <motion.button whileHover={{ ...scaleUp }} className={styles.Arrow} onClick={previousPageHandler}>&#8592;</motion.button>
            <div className={styles.index}>
              <p><input className={styles.setPageNum} type="number" min={0}
              id="setPageNum" onKeyDown={searchPage} placeholder={pageNumber}/>/{numPages}</p>
            </div>
            <motion.button whileHover={{ ...scaleUp }} className={styles.Arrow} onClick={nextPageHandler}>&#8594;</motion.button>        
          </div>  
      </div>

      {
        showComments &&
        <div className={styles.commentsWrapper}>
          <Comments commentsLoaded={commentsLoaded} setCommentsLoaded={setCommentsLoaded} commentsOnBook={comments} bookId={bookId} bookName={title} owner={ownerId} />        
        </div>
      }   
      <Modal
      isOpen={showExpanded} 
      closeTimeoutMS={500}
      onRequestClose={() => setShowExpanded(false)}
      ariaHideApp={false}
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
              overflow: 'hidden',
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
      }    >
          <iframe height="100%" width="100%" allowtransparency = "true" src={`${file}#view=FitH&page=${pageNumber}`}></iframe>
      </Modal>
          
      <div className={styles.navAndComments}>

      <motion.div className={styles.expandBook} whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }} onClick={showExpandedPDF}>
        <Image src="/static/expand_Book.svg" width={20} height={20}  alt="upArrow" />
      </motion.div>
      
        <div className={styles.navigateBooks}>
          <motion.button whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }} onClick={BookChangePrevious} className={styles.navigateBooksButton} >
          <div className={styles.upArrow}>
            <Image src="/static/upArrow.svg" width={50} height={50} alt="upArrow" />
          </div>
          </motion.button>            
          <motion.button whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }} className={styles.navigateBooksButton} onClick={BookChangeNext}>
          <div className={styles.downArrow}>
            <Image src="/static/downArrow.svg" width={50} height={50} alt="downArrow" />
          </div>
          </motion.button>
        </div>   
         
        <div className={styles.commentsIconWrapper}>
          
          <Image src="/static/CommentsIcon.png" onClick={handleShowComments} width="100%" height="20%"  layout="responsive"  objectFit="contain" alt="Show Comments Icon" />
          <p>{nFormatter(commentCount, 2)}</p>
      </div>  
      
      
      </div>            
        </div>

      
      </div>    
  
    </div>
    
  );

}


export default PDFViewer;