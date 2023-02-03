import styles from './trending_libraries.module.css'
import {useState,useEffect} from 'react'
import LibraryCard from './library_cards/LibraryCard'
import CreateLibPopUp from '../CreateLibPopUp/createLib';
import Blur from "react-blur";
import {motion} from 'framer-motion'
import Image from 'next/image'
// import Slider from 'react-slick'
import Modal from 'react-modal';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination, Autoplay } from "swiper";

const TrendingLibraries = (props) => {
    const {libraries=[], joined, setJoined, setLibCreated, libCreated} = props
    const [createLib, setCreateLib] = useState(false)
    const [imageIndex, setImageIndex] = useState(4)
    const [windowWidth, setWindowWidth] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [isJoined, setIsJoined] = useState(joined)
    const [myLibraryIds, setMyLibraryIds] = useState([])
    const [libraryLength, setLibraryLength] = useState(libraries.length)
    // console.log(libraries)

    useEffect(()=>{
        setJoined(!joined)
    },[isJoined])
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

    const handleCreateLib = () => {
        setCreateLib(!createLib)
    }

    const scaleUp = {scale: 1.1};
    const scaleDown = {scale: 0.95}

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            setIsLoggedIn(false)
        }
        const getAdminLevel = async() => {
            if (localStorage.getItem('access_token')) {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", localStorage.getItem("access_token"));
        
                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };
            
                const res = await fetch(`https://noteshare.live/api/libraries/mine/`, requestOptions)
                if (res.status == 200) {
                    const libraries = await res.json();
                    setMyLibraryIds(libraries)
                } else if (res.status == 401) {
                    localStorage.removeItem('access_token')
                    setIsLoggedIn(false)
                    console.log(`Error: Session Expired, Please Sign In Again`)
                }
                else {
                    alert('failed fetching my libraries trending libraries')
                }
            };
          }
          getAdminLevel()
    }, [])



    const backgroundImage = libraries[imageIndex]?.banner.split("/backend")[1]


  return (
    <div>
        {libraries.length > 0 && 
        <div>            
            <div className={styles.background} style={{
                backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}
                >                
                <div >
                <h2 className={styles.trending}>Top Libraries</h2>                
                </div>
                <Blur className="blurImage" img={backgroundImage} blurRadius={50} enableStyles shouldResize>       
                
                    <div className={styles.container}>
                    <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    // centeredSlides={true}
                    slidesPerView={3}
                    data-swiper-autoplay={2000}
                    initialSlide={imageIndex}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                      }}
                    onSlideChange={(swiper) => {setImageIndex(swiper.realIndex + 1)}}
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    loop={true}
                    pagination={{clickable: true}}
                    preventInteractionOnTransition={true}
                    modules={[Autoplay, EffectCoverflow, Pagination]}
                    className="mySwiper"
                  >
        
                        {libraries?.map((library, idx) => {
                            
                            return (
                                <SwiperSlide key={idx}>
                                    <div className={idx === document.getElementsByClassName("mySwiper").activeIndex ? 'activeSlide': "slide"} key={idx}>
                                    <LibraryCard 
                                    class="swiper-slide"
                                    activeSlide={idx == document.getElementsByClassName("mySwiper").activeIndex ? 'activeSlide': 'slide'}
                                     myLibrary={myLibraryIds.length > 0 ? myLibraryIds.includes(library.id) ? true: false: false} title={library.title} joined={isJoined} setJoined={setIsJoined} isLoggedIn={isLoggedIn} id={library.id} banner={library.banner.split("/backend")[1]} patronCount={library.patrons} />    
                                </div>
                                </SwiperSlide>
                            
                        )})}            
                        </Swiper>
                    </div>   
                                    
                </Blur>  

            </div> 
            { isLoggedIn &&
              <motion.div className={styles.createLibWrapper} onClick={() => {setCreateLib(true)}} whileHover={{ ...scaleUp }} whileTap={{ ...scaleDown }}>
                <div className={styles.addLibrary}>
                    <p className={styles.addLibraryIcon}>
                        +
                    </p> 
                </div>
                
                <div className={styles.createLibraryWrapper}>
                    <h2 className={styles.createLibrary}>Create Library</h2>
                </div>             
            </motion.div>  
            }
            
            
            <Modal 
            isOpen={createLib} 
            ariaHideApp={false}
            closeTimeoutMS={500}
            onRequestClose={() => setCreateLib(false)}
            style={
                {
                    overlay: {
                        color: '#fff',
                        background: 'rgba( 0, 0, 0, 0.5 )',
                        backdropFilter: 'blur(15px)',
                        zIndex: '900'
                    },
                    content: {
                        width: '90%',
                        justifyContent: 'center',
                        margin: 'auto',
                        height: "90vh",
                        overflowX: "hidden",
                        color: '#fff',
                        background: 'rgba( 0, 0, 0, 0.45 )',
                        border: 0,
                        borderRadius: '2vw',
                        zIndex: '900'
                        
                    }
                }
            }>
                <CreateLibPopUp setLibCreated={setLibCreated} libCreated={libCreated} closeModal={setCreateLib} />
            </Modal>
                    
        </div>
            }
            { libraries.length <= 0 &&
                <div >
                    <h1 className={styles.noLibraries}>There are no libraries to display :(</h1>
                </div>                
            }

    </div>
  )
}

export default TrendingLibraries
