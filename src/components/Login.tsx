import React, { use, useEffect } from 'react'

import { useHistory } from "react-router-dom";

function Login  ()  {

    // const history = useHistory();
    // useEffect(() => {
    //   if (localStorage.getItem("user-info")) {
    //     history.push("/home");
    //   }
    // })
  return (
    <div>
    <h1>Login</h1>
 <div className="flex min-h-screen items-center justify-center bg-white p-4"> 
  <input type='text' placeholder='Username' className='form-control' /> <br/>
    <input type = "text" placeholder = "Email" className='form-control' /><br/>
    <input type='password' placeholder='Password'  className='form-control'/><br/>
 
  <button className='btn btn-primary'>Login</button>
 </div>
  
    
    </div>
  )
}

export default Login
