'use client'

import { useSession,signIn,signOut } from "next-auth/react"

export default function () {
    const {data :session} = useSession();
    if(session){
        return <div>
            <div>{JSON.stringify(session.user)}</div>
            <button onClick={()=>signOut()}>Sign out</button>
        </div>   
    }
    return <div>
        Not sign 
        </div>
}