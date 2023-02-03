import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import Switch from "react-switch";
import Link from 'next/link';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import styles from '../../styles/create.module.css'
import styled, {createGlobalStyle, css} from 'styled-components'


const CreateLibPopUp = (props) => {
  const router = useRouter()

  const getAllUsers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };    
    const fetchUsers = async() => {
      const res = await fetch("https://noteshare.live/api/users/", requestOptions)
      if (res.status == 200) {
        const Patrons = await res.json();
        setUsers(Patrons)

      } else {
        alert('failed fetching my liked books')
      }      
    }
    fetchUsers()
}

useEffect(() => {
  getAllUsers()
}, [])

  const library = router.query.create
  const {closeModal, setLibCreated, libCreated} = props


  const sharedStyles = css`
  height: 40px;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  margin: 4vh auto 6vh auto;
  padding: 20px;
  align-items: center;
  box-sizing: border-box;

  `

  const StyledFormWrapper = styled.div`
  position: relative;
  left: 20%;
  display: flex;
  justify-content: center;
  height: 100%;
  
  `

  const StyledForm = styled.div`
  width: 80%;
  max-width: 700px;
  padding: 4vh;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 1.2);

  `

  const StyledInput = styled.input`
  border: 0;
  display: grid;
  color: #fff;
  grid-template-rows: 1fr 1fr;
  border-bottom: 1px solid #fff;
  background: transparent;
  ${sharedStyles}
  `

  const StyledTextArea = styled.textarea`
  justify-content: center;
  display: grid;
  grid-template-rows: 1fr 1fr;
  background-color: #000;
  color: #fff;
  width: 80%;
  min-height: 100px;
  resize: none;
  ${sharedStyles}
  `

  const StyledButton = styled.button`
  display: inline-block;
  background-color: rgba( 0, 0, 0, 0.15 );
  margin-bottom: 2vh;
  color: #fff;
  font-size: 1.9vh;
  border-radius: 2vw;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  box-sizing: border-box;
  `

  const StyledFieldSet = styled.fieldset`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 20px 0;

  legend {
    padding: 0 20px;
  }

  label {
    padding-right: 20px;
  }
  input {
    margin-right: 10px;
  }
  `

  const StyledError = styled.div`
  color: red;
  font-weight: 300;
  margin: 0 0 40px 0;
  `

  const [imageIndex, setImageIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState(true)
  const [patrons, setPatrons] = useState('')
  const [users, setUsers] = useState([])
  const [files, setFile] = useState("");
  const [libraryCreated, setLibraryCreated] = useState(false);
  const [createdLibraryId, setCreatedLibraryId] = useState(null);
  

  // visibility: true - Private, false - Public



  const getUsers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const fetchUsers = async() => {
      const res = await fetch("https://noteshare.live/api/users/", requestOptions)
      if (res.status == 200) {
        const Patrons = await res.json();
        setUsers(Patrons)

      } else {
        alert('failed fetching my liked books')
      }      
    }
    fetchUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  

  const Next = ({onClick}) => {
    return (
        <div className={styles.NextWrapper} onClick={onClick}>
            <StyledButton>Next</StyledButton> 
        </div>            
    )

}
const Prev = ({onClick}) => {
    return (
      <div className={styles.PrevWrapper} onClick={onClick}>
      <StyledButton>Previous</StyledButton> 
  </div>             
    )

}

  const settings = {
    dots: true,
    speed: 300,
    swipe: false,
    slidesToShow:1,
    centerMode: true,
    centerPadding: 0,
    nextArrow: <Next />,
    prevArrow: <Prev />,
    initialSlide: 3,
    beforeChange: (current, next) => setImageIndex(next),
    afterChange: current => setImageIndex(current)
}

  const animatedComponents = makeAnimated();

  const getPatrons = (selectedOptions) => {
    setPatrons(selectedOptions)
  }

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: '#fff',
      backgroundColor: '#000',
      padding: 20,
    }),
  
    control: (_, { selectProps: { width }}) => ({
      
    }),
  
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }
  const handleCreateLibrary = (e) => {
    e.preventDefault()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('access_token'));

    var formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("public", visibility);
    formdata.append("banner", document.getElementById("libBanner").files[0], "/C:/Users/derri/Documents/noteshare_2/frontend/public/static/library_banners/lambo_banner 1.png");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };    

    const createLibrary = async() => {
      const res = await fetch("https://noteshare.live/api/libraries/", requestOptions)
      if (res.status == 201) {
        setLibCreated(!libCreated)
        const library = await res.json();
        setCreatedLibraryId(library.message.split(" ")[3])
        setLibraryCreated(true)
      } 
      if (res.status == 401) {
        alert('failed creating library, please sign in')
      } 
      else {
        alert('failed creating library')
      }      
    }
    createLibrary()
  }

  const changeVisibility = () => {
    setVisibility(!visibility)
    
  }

  useEffect(() => {
    console.log(visibility)
  }, [visibility])

// <StyledFormWrapper>
//   <StyledForm>
//     <h2>Add Patrons</h2>  
//    <label htmlFor="patrons">Patrons</label>
//    <Select closeMenuOnSelect={false}
//           components={animatedComponents}
//           getOptionLabel={option => option.username}
//           getOptionValue={option => option.id}
//           options={users}
//           onChange={(getPatrons)}
//           value={patrons}
//           styles={customStyles}
//           isMulti  type="text" name="description" placeholder="Usernames"/>  
//   </StyledForm>           
// </StyledFormWrapper>
  return (
    <div className={styles.container}>
        <h1 className={styles.close} onClick={() => closeModal(false)}>x</h1>
        {libraryCreated == false &&
          <form onSubmit={handleCreateLibrary}>
                  <h2>Create Library</h2>  
                <label htmlFor="name" >Title</label>
                <StyledInput onBlur={(event) => {setTitle(event.target.value);}} type="text" defaultValue={title} name="name" required placeholder='Title' id="title"/>
                
                <StyledFieldSet>
                    <legend>Visibility</legend>
                    <div className={styles.visibility}>
                        <label>
                          <p>Public</p>
                        </label>
                        <Switch 
                        className={styles.visibilitySwitch} 
                        checked={!visibility} 
                        onChange={changeVisibility}
                        onColor="#FC9993"
                        onHandleColor="#FC7753"
                        handleDiameter={30}
                        uncheckedHandleIcon={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              fontSize: 20
                            }}
                          >
                          &#127758;
                          </div>
                          
                        }
                        checkedHandleIcon={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              fontSize: 20
                            }}
                          >
                          &#128274;
                          </div>}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        id="material-switch"
                         />
                        <label>
                          <p>Private</p>
                        </label>                      
                    </div>
                    
                </StyledFieldSet>
                    <label htmlFor="message">Description</label>
                    <StyledTextArea required onBlur={(event) => {setDescription(event.target.value)}} defaultValue={description} name="message" id='description' /> 
                    <label htmlFor="message">Banner</label>
                    <StyledInput type="file" required id="libBanner" accept="image/*" /> 
                    <StyledButton type="submit" id="create">Create Library</StyledButton>
                </form>  
        }
                       
            {libraryCreated &&
              <div>
                <h1>Congratulations!</h1>
                <Link href={`/libraries/${createdLibraryId}`}><a>Take me to {title}</a></Link>
              </div>
            }
    </div>

  )
}

export default CreateLibPopUp