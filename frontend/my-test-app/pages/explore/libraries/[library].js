import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import LibraryExplore from '../../../components/libraryExplore/library'
import styles from '../../../styles/findLibraries.module.css'
import Navbar from '../../../components/navbar/navbar'

const Library = () => {
    
  const router = useRouter()

  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [allPublicLibraries, setAllPublicLibraries] = useState([])

  const getAllBooksDefault = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
 
  const fetchAllPublicBooks = async() => {
    const res = await fetch('https://noteshare.live/api/libraries/public-default?limit=50', requestOptions)
    if (res.status == 200) {
      const AllPublicLibraries = await res.json();
      setAllPublicLibraries(AllPublicLibraries)

    } else {
      alert('failed fetching libraries default')
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
    const res = await fetch('https://noteshare.live/api/libraries/public?limit=50', requestOptions)
    if (res.status == 200) {
      const AllPublicLibraries = await res.json();
      setAllPublicLibraries(AllPublicLibraries)
      console.log(AllPublicLibraries)
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
        <LibraryExplore libSet={allPublicLibraries} />
    </div>
  )
}

export default Library
