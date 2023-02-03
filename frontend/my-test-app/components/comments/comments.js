import styles from './comments.module.css';
import { Fragment } from 'react';
import Comment from './comment/comment'
import comments from '../../data/comments.json'
import Loading from '../loading/loading';
import {useEffect, useState} from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image'

import CommentSkeleton from './commentSkeleton';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Comments = (props) => {

  const {bookName, setCommentsLoaded, commentsLoaded, owner, bookId, commentsOnBook} = props

  const router = useRouter()

  const [username, setUsername] = useState('') 
  const [comment, setComment] = useState('')
  const [commentSent, setCommentSent] = useState(false)
  const [commentList, setCommentList] = useState(commentsOnBook)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  // const [commentsLoaded, setCommentsLoaded] = useState(false)
  

  const handleSendComment = (e) => {
    e.preventDefault()
    if (localStorage.getItem('access_token')) {
      var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "book_id": bookId,
      "content": comment
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
      const postComment = async() => {   
      const res = await fetch(`https://noteshare.live/api/comments/`, requestOptions)
      if (res.status == 200) {
         setComment('')
        setCommentSent(!commentSent)      
      }
      if (res.status == 401) {
         return 
      } else {
        return
      }
    }
    postComment()
    } else {
      console.log('not logged in')
    }

    
  }


  const fetchCommentsDefault = () => {
    var requestLibBooksOptions = {
      method: 'GET',
      redirect: 'follow'
    };
      const fetchCommentsFromBookDefault = async() => {
        if (bookId === null) {return};
        const res = await fetch(`https://noteshare.live/api/comments/default/${bookId}`, requestLibBooksOptions)
        if (res.status == 200) {
          const bookComments = await res.json();
          setCommentList(bookComments)
          setTimeout(function(){
            setCommentsLoaded(true)
          }.bind(),800);
          // console.log(bookComments)

        } else {
          alert('failed fetching comments Default')
        }
      }
    fetchCommentsFromBookDefault()
  }

  const fetchComments = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));

  var requestLibBooksOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
      const fetchCommentsFromBook = async() => {
        if (bookId === null) {return}
        const res = await fetch(`https://noteshare.live/api/comments/${bookId}`, requestLibBooksOptions)
        if (res.status == 200) {
          const bookComments = await res.json();
          setCommentsLoaded(true)
          setCommentList(bookComments)
          // console.log(bookComments)

        } 
        else if (res.status == 401) {
          fetchCommentsDefault()
        } 
        else {
          alert('failed fetching comments')
        }
      }
    fetchCommentsFromBook()
  }

  useEffect(() => {
    if (router.isReady) {
    fetchCommentsDefault()
    }
    
  }, [router.isReady, commentsOnBook])

  useEffect(() => {
  if (localStorage.getItem('access_token')) {
    fetchComments()
  } else {
    fetchCommentsDefault()
  }
  }, [commentSent, liked])

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const voteComment = async(dir, commentId) => {
    if (localStorage.getItem('access_token')) {
      var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "dir": dir,
      "comment_id": commentId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };  
      const res = await fetch("https://noteshare.live/api/vote-comment/", requestOptions)
      if (res.status == 200) {
        console.log("voted")
        setLiked(!liked)
      } 
      else if (res.status == 401) {
        return
      } 
      else if (res.status == 409) {
        console.log("Failed Liking Comment")
      } 
      else {
        alert('failed liking comment')
      }
    }
    
}

  return (
    <div className={styles.container}>
      <div className={styles.commentsContainer}>
        <div className={styles.text}>
        <div className={styles.header} >
          <h1>{bookName}</h1>     
        </div>
        <div className={styles.comments}>
        {!commentsLoaded &&
          <Fragment >
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </Fragment>
          
        
      }
        {commentsLoaded &&
        <>
        {
          commentList.length > 0 && 
          <div>
                {commentList.map((Mycomment, idx) => {
                  // fetchUser(Mycomment.user_id)
                  return(
                    <div key={idx}>
                    <div className={styles.commentSection}>
                        <div className={styles.profileAndUsername}>
                          <div className={styles.profile}></div>
                            
                          <div className={styles.accountName} >
                              {owner == Mycomment.id ? <b><p>{Mycomment.owner}</p></b>:<p><b>{Mycomment.owner}</b></p>}
                            </div>   
                          </div>
                        <div className={styles.like} style={{visibility: localStorage.getItem("access_token") ? 'visible': 'hidden'}} onClick={() => {voteComment(Mycomment.liked ? -1: Mycomment.disliked ? 1: 1, Mycomment.id)}}>
                          {Mycomment.disliked &&
                            <Image src="/static/likeComment.svg" width={20} height={20}></Image>
                          }
                          {Mycomment.liked &&
                            <Image src="/static/LikedComment.svg" width={20} height={20}></Image>
                          }
                          {!Mycomment.liked &&
                            <>
                              {!Mycomment.disliked &&
                              <Image src="/static/likeComment.svg" width={20} height={20}></Image>
                              }
                            </>
                          }
                          </div>
                          
                          <div className={styles.comment}  >
                            <div className={styles.content} >
                              <p>{Mycomment.content}</p>          
                            </div>
                            <div className={styles.like}>
                             <b><p>{Mycomment.likes}</p></b>
                            </div>
                          </div>          
                        </div>
                    </div>
                  )
              })}            
          </div>
        }
        {
          commentList.length <= 0 &&
          <div>
              <h3 className={styles.noCommentsHeader}>Be the first to comment!</h3> 
          </div>
        }        
        </>
        }
        </div>    
        </div>
      </div>
      <div className={styles.submitCommentContainer}>
          <form onSubmit={handleSendComment}>
              <input className={styles.typeComment} placeholder="Share your thoughts on the post :)" value={comment} onChange={handleCommentChange} maxLength={100} required />
              <button type="submit" className={styles.submitCommentBtn}>
                <Image src="/static/send_message.svg" alt="send commment" width={20} height={20} />
              </button>    
          </form>
        </div>  
    </div>
    
  )
}

export default Comments