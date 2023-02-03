import Navbar from "../../../../components/navbar/navbar";
import styles from "../../../../styles/Home.module.css"

import PDFViewer from "../../../../components/book/pdf-viewer"

import {useEffect, useState} from 'react'

import {useRouter} from 'next/router'


const Book = () => {

  const router = useRouter()

  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [allPublicBooks, setAllPublicBooks] = useState([])

  const getAllBooksDefault = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
 
  const fetchAllPublicBooks = async() => {
    const res = await fetch('https://noteshare.live/api/books/public-default?limit=50', requestOptions)
    if (res.status == 200) {
      const AllPublicBooks = await res.json();
      setAllPublicBooks(AllPublicBooks)
      console.log({AllPublicBooks})

    } else {
      alert('failed fetching books default')
    }      
  }
  fetchAllPublicBooks()
}

  const getAllBooks = () => {
    // get all public
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
 
  const fetchAllPublicBooks = async() => {
    const res = await fetch('https://noteshare.live/api/books/public?limit=50', requestOptions)
    if (res.status == 200) {
      const AllPublicBooks = await res.json();
      setAllPublicBooks(AllPublicBooks)
      console.log({AllPublicBooks})
    } 
    if (res.status == 401) {
      getAllBooksDefault()
    } 
    else {
      return
    }      
  }
  fetchAllPublicBooks()
}
useEffect(() => {
  try{
    if (localStorage.getItem('access_token')) {
    getAllBooks()
    } else {
      getAllBooksDefault()
    }
  }
  catch (err) {
    getAllBooksDefault()
    console.error(err)
  }
}, [])


  useEffect(() => {
    router.beforePopState(({ as }) => {
        if (as !== router.asPath) {
            router.push("/libraries")
        }
        return true;
    });

    return () => {
        router.beforePopState(() => true);
    };
}, [router.isReady]);

  return (
    
    <div className={styles.container}>
      <Navbar />
     
      <div className={styles.content} >
            <PDFViewer bookSet={allPublicBooks} />
      </div>
    </div>
    )
}

// export async function getServerSideProps() {
//   const url = "https://noteshare.live/api/books"
//   console.log(url)
//   const res = await fetch(url);
//   const dataExport = await res.json();
//   console.log(dataExport)
//   return { props: {dataExport} }
// }

  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", process.env.JWT_TOKEN);
  // var requestOptions = {
  //   method: 'GET',
  //   headers: myHeaders,
  //   redirect: 'follow'
  // };

// export async function getServerSideProps() {
//     const res = await fetch('https://noteshare.live/api/books/', requestOptions)
//      const books = await res.json()
//      console.log(books);
  
//     return { props: {books} }
// }

export default Book;