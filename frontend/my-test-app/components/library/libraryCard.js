import styles from './libraryCard.module.css'
import { useState } from 'react'
import Image from 'next/image'
import {motion} from 'framer-motion'
import Modal from 'react-modal'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'

const LibraryCard = (props) => {

    const {filePath="/static/thumbnails/Big_O_Notation.png", edited, setEdited, description, setDeleted, deleted, myBook=false, library='explore', id=0, title, downVotes=0, upVotes=0} = props
    
    const router = useRouter()
    const [dropDown, setDropDown] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description)
    const [editModal, setEditModal] = useState(false)

    const deleteBook = async() => {

      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem("access_token"));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      const res = await fetch(`https://noteshare.live/api/books/${id}`, requestOptions)
      if (res.status == 204) {
        setDeleted(!deleted)
        setDropDown(false)
        console.log('deleted')
      } 
      else if (res.status == 401) {
        alert("Failed deleting book, please sign in again")
      } 
      else {
        alert('failed deleting book')
      }
    }

    const editBook = async(e) => {
      e.preventDefault()
      var myHeaders = new Headers();
      myHeaders.append("Authorization", localStorage.getItem("access_token"));
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "title": editedTitle,
        "description": editedDescription
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const res = await fetch(`https://noteshare.live/api/books/${id}`, requestOptions)
      if (res.status == 200) {
        setEdited(!edited)
        setEditModal(!editModal)
        console.log('edited')
      } 
      if (res.status == 401) {
        alert("failed editing book, please sign in again")
      } 
      else {
        alert('failed editing book')
      }
    }




    const optionsClicked = () => {
      if (localStorage.getItem('access_token')) {
      setDropDown(!dropDown)
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

    const scaleUp = {scale: 1.01};
    const scaleDown = {scale: 1}


  return (
    <div className={styles.container}>
          <motion.div  className={styles.booksContainer} whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }}>
          {localStorage.getItem('access_token') &&
            <div>
             {
                myBook &&
                <div>
                  <div className={styles.extraOptions}>
                    <h3 onClick={optionsClicked}>...</h3>
                  </div>
                  {
                    dropDown &&
                    <div className={styles.options}>
                      <div onClick={deleteBook} className={styles.option}>
                        <p>Delete</p>
                      </div>
                      <div onClick={() => {setEditModal(true); setDropDown(false)}} className={styles.option}>
                        <p>Edit</p>
                      </div>
                    </div>
                  }
                  <Modal
                  isOpen={editModal} 
                  closeTimeoutMS={500}
                  onRequestClose={() => setEditModal(false)}
                  ariaHideApp={false}
                  style={
                    {
                      overlay: {
                          color: '#fff',
                          background: 'rgba( 0, 0, 0, 0.0 )',
                          zIndex: '900'
                      },
                      content: {
                          width: '40%',
                          justifyContent: 'center',
                          margin: 'auto',
                          height: "90vh",
                          overflowX: "hidden",
                          color: '#fff',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 0,
                          borderRadius: '2vw',
                          zIndex: '900'
                          
                      }
                  }
                  }>
                  <form className={styles.editForm} onSubmit={editBook}>
                    <label className={styles.formHeader}>
                      <h2>Edit Book {title}</h2>
                    </label>
                    <div>
                      <label className={styles.editLabels} >Title</label>
                      <input type="text" value={editedTitle} onChange={(e) => {setEditedTitle(e.target.value)}} className={styles.editInput} id="title" />
                      <label className={styles.editLabels}>Description</label>
                      <textarea type="text" value={editedDescription} className={styles.editDescriptionInput} onChange={(e) => {setEditedDescription(e.target.value)}} id="description" />                
                    </div>
                    <button>Edit Book</button>
                  </form>
                  
                  </Modal>
                </div>
              }      
            </div>
        }
          
        <Link href={`/explore/${library}/book/book?title=${id}`}>     
        <div>
           <h3 className={styles.bookName}>{title}</h3>
            <div className={styles.pageWrapper}>
                <img className={styles.bookThumbnail} src={filePath} />                      
            </div>    
            <div className={styles.detailsWrapper}>
                <div className={styles.Vote}>
                    <div className={styles.Vote2}>
                        <Image src="/static/spearUp.svg" width="100%" height="100%"  layout="responsive"  objectFit="contain" alt="upVote" /> 
                        <h3 className={styles.detailNums}>{nFormatter(upVotes, 2)}</h3>      
                    </div>      
                    
                    <div className={styles.Vote1}>
                        <Image src="/static/spearDown.svg" width="100%" height="100%"  layout="responsive"  objectFit="contain" alt="downVote" /> 
                        <h3 className={styles.detailNums}>{nFormatter(downVotes, 2)}</h3> 
                    </div>         
                    </div>
                </div>        
        </div>     
  
        </Link>      
      </motion.div>
    </div>

  )
}

export default LibraryCard