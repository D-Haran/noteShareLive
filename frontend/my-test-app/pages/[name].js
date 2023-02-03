import React from 'react'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'

const Name = ({dataExport}) => {
    const router = useRouter()
    const {name}= router.query

    // const [description, setDescription] = useState("")
    let description;
    return(
        <div>404 Page :(</div>
    )
// Option 1
// useEffect(() => {
//   if (!router.isReady) return;
//   console.log(title)
//   files.map(function(book) {
//     if (book.id === title) {
//       setDescription(book.description)
//     }
//   })
// }, [router.query.title, router.isReady, title])

//Option 2
// useEffect(() => {
//     if (!router.isReady) return;
//     console.log(router.query)
//     dataExport.map(function (item) {
//       if (item.name === name) {
//         setDescription(item.name + " : " + item.description)
//       }
//     })
//   }, [])  

// Option 3: Server Side Props
// dataExport.map(function (item) {
//     if (item.name === name) {
//     description = item.name + ':' + item.description
//     }
// })


// Option 4: Server-side props inline

}

// // get server side props
// export async function getServerSideProps() {
//   const url = "http://localhost:3000/api/hello"
//   console.log(url)
//   const res = await fetch(url);
//   const dataExport = await res.json();
//   return { props: {dataExport} }
// }
export default Name

