import styles from './library.module.css'
import { useRouter } from 'next/router'
import {useState, useEffect} from 'react'
import LibraryCard from '../library_cards/libraryCard'
import Link from 'next/link'
import Slider from 'react-slick'
import { motion } from 'framer-motion'
import Image from 'next/image'

const LibraryExplore = (props) => {
    const {libSet=[]} = props

    const router = useRouter()

    const [libId, setLibId] = useState(router.query.title)
    const [index, setIndex] = useState(null)
    const [owner, setOwner] = useState('')
    const [ownerId, setOwnerId] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [bookSet, setBookSet] = useState([])
    const [libBanner, setLibBanner] = useState('')
    const [imageIndex, setImageIndex] = useState(1)

    console.log(libSet)

    useEffect(() => {
        // console.log("general")
        if (!router.isReady) return;
        const elementPos = libSet.map(function(lib) {return lib.id; }).indexOf(libId)
        setIndex(elementPos)
        libSet.map(function(library) {
          if (library.id === parseInt(libId)) {

            var requestLibBooksOptions = {
                method: 'GET',
                redirect: 'follow'
              };
             
              const fetchBooksFromMyLibraries = async(IndlibId) => {
                const res = await fetch(`https://noteshare.live/api/books/from-library-default/${library.id}?limit=8`, requestLibBooksOptions)
                if (res.status == 200) {
                  const publicBooks = await res.json();
                  console.log({publicBooks})
                  setBookSet(publicBooks)
                } else {
                  alert('failed fetching books from library')
                }
            
              }
                fetchBooksFromMyLibraries()

            setLibId(library.id)
            setOwner(library.owner)
            setOwnerId(library.owner_id)
            setTitle(library.title)
            setDescription(library.description)
            setLibBanner(library.banner)
          } 
        })
      }, [router.query.title, libId, libSet])

      function LibChangeNext() {
        if(index !== libSet.length - 1) {
        setIndex(index => index + 1)
        const library = libSet[index + 1]
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            title: library.id
          }
        })
        // setupVotes(myUpVotes)
        setLibId(library.id)
        setOwner(library.owner)
        setOwnerId(library.owner_id)
        setTitle(library.title)
        setDescription(library.description)
        setLibBanner(library.banner)
        } else {
          return
        } 
    }    
    
    function LibChangePrevious() {
        if(index !== 0) {   
        setIndex(index => index - 1)
        // console.log("bookChange: ", index)
        const library = libSet[index - 1]
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            title: library.id
          }
        })
        setLibId(library.id)
        setOwner(library.owner)
        setOwnerId(library.owner_id)
        setTitle(library.title)
        setDescription(library.description)
        setLibBanner(library.banner)
        } else {
          return
        }

    }

      const libraryStyle = {
        backgroundImage:` url(${libBanner.split("/backend")[1]})`,
        width: '100vw',
        backgroundPosition: 'center',
        MozBackgroundSize: "cover",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflowX: 'hidden'
      }

    const NextArrow = ({onClick}) => {
      return (
          <div className={styles.arrowNextWrapper} onClick={onClick}>
              <Image className={styles.arrownext} alt="nextTrendingLibraryButton" src="/static/arrow_forward.svg" width="50%" height="50%" />
          </div>            
      )

  }
  const PrevArrow = ({onClick}) => {
      return (
          <div className={styles.arrowBackWrapper} onClick={onClick} >
              <Image className={styles.arrowBack} alt="PreviousTrendingLibraryButton" src="/static/arrow_back.svg" width="50%" height="50%" />
          </div>            
      )

  }

    const settings = {
      infinite: true,
      speed: 400,
      slidesToShow: 8,
      centerMode: true,
      centerPadding: 0,
      initialSlide: 0,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      beforeChange: (current, next) => setImageIndex(next),
      afterChange: current => setImageIndex(current)
  }

    const scaleUp = {scale: 1.1};
    const scaleDown = {scale: 0.95}

  return (
    <div className={styles.container} style={libraryStyle}>
    <div className={styles.libContainer}>
        <div className={styles.libraryView}>
            <Link href={`/libraries/${libId}`}>
                <h2 className={styles.libContainerTitle}>{title}</h2>
            </Link> 
            <div className={styles.booksContainer}>
              {bookSet.map((book,idx) => {
                        return (
                          <div className={idx === imageIndex ? 'activeSlide': "slide"} key={idx}>
                            <LibraryCard key={idx} title={book.title} filePath={book.thumbnail.split("/backend")[1]} />
                          </div>
                        )
                    })}
                
                {bookSet.length == 0 &&
                  <h2 className={styles.libContainerTitle}>No Books In Library</h2>
                }
            </div>
                
        </div>
        <div className={styles.navigateBooks}>
            <motion.button whileHover={{ ...scaleUp }} onClick={LibChangePrevious} whileTap={{ ...scaleDown }} className={styles.navigateBooksButton} >
            <div className={styles.upArrow}>
            <Image src="/static/upArrow.svg" width={50} height={50} alt="upArrow" />
            </div>
            </motion.button>            
            <motion.button whileHover={{ ...scaleUp }} onClick={LibChangeNext} whileTap={{ ...scaleDown }} className={styles.navigateBooksButton} >
            <div className={styles.downArrow}>
            <Image src="/static/downArrow.svg" width={50} height={50} alt="downArrow" />
            </div>
            </motion.button>
        </div>
    </div>
        

    </div>
    
  )
}

export default LibraryExplore