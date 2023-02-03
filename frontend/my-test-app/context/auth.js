import { createContext, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import jwt_decode from "jwt-decode"

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    authReady: false
})

export const AuthContextProvider = ({ children }) => {
    const router = useRouter()

    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null)
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)

    const fetchUser = async() => {
        try {   
            if (router.isReady) {
                const token = localStorage.getItem('access_token');
            // const decoded = jwt_decode(token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", token);
    
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };
    
            const res = await fetch(`https://noteshare.live/api/users/myprofile`, requestOptions)
            try{
              if (res.status == 200) {
            const result = await res.json();
            setUser(result.username)
            setUserId(result.id)
            setFollowers(result.followers)
            setFollowing(result.following)
            // console.log(result)
            } 
            else if (res.status == 401) {
                localStorage.removeItem("access_token");
                setUser(null)
            } 
            else {
            setUser(null)
            }   
            } catch (error) {
                return
            }
              
            }                    
            
        } catch(error) {
            console.log("no bearer token")
        }
    }

      const context = {user, setUser, userId, followers, setFollowers, following, setFollowing, fetchUser}

    return (
        <AuthContext.Provider value={context}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext