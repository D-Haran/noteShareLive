import Navbar from "../components/navbar/navbar";
import styles from "../styles/Home.module.css"
import Loading from "../components/loading/loading";

import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'

export default function PDF() {
  const router = useRouter()
  const [calledPush, setCalledPush] = useState(true);

  useEffect(() => {
    if (calledPush) {
          router.replace('/explore/') 
          setCalledPush(false)
    } else {
      return (
        <Loading />
      )
    }

  }, [])
  return(
    <></>
  )
}
 
