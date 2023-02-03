import {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import Loading from '../../components/loading/loading';

export default function PDF() {

  const [bookId, setBookId] = useState(null)

  var requestLibBooksOptions = {
    method: 'GET',
    redirect: 'follow'
  };
 
  const fetchBooksFromMyLibraries = async(IndlibId) => {
    const res = await fetch(`https://noteshare.live/api/books/public-default?limit=50`, requestLibBooksOptions)
    if (res.status == 200) {
      const publicBooks = await res.json();
      setBookId(publicBooks[0].id)
      console.log(publicBooks[0].id)

    } else {
      alert('failed fetching my libraries fetchBooksFromMyLibraries')
    }

  }
  useEffect(() => {
    fetchBooksFromMyLibraries()
  }, [])

  const router = useRouter()

  if (bookId === null) {
    console.log("loading...")
    return <Loading />
  };
  router.replace(`/explore/explore/book/book?title=${bookId}`)
}
