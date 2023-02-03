import SectionCards from '../library_cards/sectionCards/SectionCards';
import {useEffect, useState} from 'react'

const NotSignedInLibraries = (props) => {

    const {publicLibraries} = props 


  return (
    <div>
        {
            publicLibraries.map(library => [
                <div key={library.id}>
                <SectionCards library={library.title} banner={library.banner} libId={library.id} visibility={library.public} patrons={library.patrons} />
                </div>
            ])
        }
    </div>
  )
}

export default NotSignedInLibraries