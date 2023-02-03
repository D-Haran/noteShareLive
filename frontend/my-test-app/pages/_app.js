import '../styles/globals.css'
import Head from 'next/head'
import {Fragment, useEffect, useState} from 'react'
import { AuthContextProvider } from '../context/auth'
import Loading from '../components/loading/loading'
import { useRouter } from 'next/router'
import { FilePathContextProvider } from '../context/splice'
import jwt_decode from "jwt-decode"
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { SkeletonTheme } from 'react-loading-skeleton'
import LoadingBar from 'react-top-loading-bar'

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {setProgress(100)})
    router.events.on('routeChangeStart', () => {setProgress(60)})

    if (router.isReady) {
      setLoaded(true)
    }

  }, [router.isReady, router.events])

  // useEffect(() => {
  //   const token = localStorage.getItem('access_token');
  //   const decoded = jwt_decode(token);
  //   console.log(decoded)
  // });

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <AuthContextProvider>    
          <Head>
            <title>NoteShare</title>
            <link rel="icon" 
            type="image/png" 
            href="/static/Logo Orange.svg" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          {!loaded &&
            <Loading />
          }
          {loaded &&
            <Fragment>
              <Component {...pageProps} />
              <LoadingBar
              color='#FC7753'
              waitingTime={400}
              progress={progress}
              onLoaderFinished={() => setProgress(0)}
            />
            </Fragment>
          }
      </AuthContextProvider>
    </SkeletonTheme>
    

  )
}

export default MyApp
