import React from "react";
import UserNav from "../../components/nav/UserNav";
import {auth} from "../../firebase";
import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
const Password = () => {
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  
  
  const handleSubmit=async (e) => {
    e.preventDefault();
    // console.log(password);
    setLoading(true);
   const user =  auth.currentUser;
    await updatePassword(user,password)
     .then(()=>{
        toast.success("Password updated successfully");
        setLoading(false);
        setPassword("");
    }).catch(err=>{
      toast.error(err.message);
      setLoading(false);
    });

  }
  const PasswordUpdateFrom= () => (
           <form  onSubmit={handleSubmit}>
           <div className="form-group">
           <label>Your Password</label>
           <input 
           type="password" 
           onChange={e=>setPassword(e.target.value)} 
           className="form-control" 
           placeholder="Enter new password" 
           disabled={loading} 
           value = {password}
           />
           <br/>
           <button className="btn btn-primary" disabled={!password ||password.length<6 || loading}>Submit</button>
          </div>
        </form>
  );
    return (<div className="container-fluid">
         <div className="row">
         <div className="col-md-2">
            <UserNav />
         </div>
         <div className="col">
          {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Password Update</h4>}
          {PasswordUpdateFrom()}
         </div>
         </div>
    </div>);
}
export default Password;