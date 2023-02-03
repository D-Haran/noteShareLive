import {useEffect, useState} from 'react'

import {useRouter} from 'next/router'

import Loading from '../../../components/loading/loading';

export default function Library() {

  const [libraryId, setLibraryId] = useState(null)

  var requestLibBooksOptions = {
    method: 'GET',
    redirect: 'follow'
  };
 
  const fetchLibraries = async(IndlibId) => {
    const res = await fetch(`https://noteshare.live/api/libraries/public-default?limit=1`, requestLibBooksOptions)
    if (res.status == 200) {
      const publicLibraries = await res.json();
      setLibraryId(publicLibraries[0].id)
      console.log(publicLibraries[0].id)

    } else {
      alert('failed fetching libraries')
    }

  }
  useEffect(() => {
    fetchLibraries()
  }, [])

  const router = useRouter()

  if (libraryId === null) {
    console.log("loading...")
    return <Loading />
  };
  router.replace(`/explore/libraries/library?title=${libraryId}`)
}
