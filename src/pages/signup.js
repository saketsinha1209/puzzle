import { useState } from "react";
import { useRouter } from "next/router";
export default function signup(){
    const [form, setForm] = useState({});
    const Handleform = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
    const router = useRouter();
    const handleSubmit =async(e) => {

        e.preventDefault();
        const stat= await fetch( `${process.env.NEXT_PUBLIC_SERVER_URL}/register`, {
          method: 'POST',
          body: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json',
          },
        
        })
        .then((res)=>res.json())
    .then((data) => {
      console.log(data,"userRgister");
      if(data.status=="success")
      {
        localStorage.setItem("token" ,data.data);
        localStorage.setItem("username" ,form.name);
         router.push("/login");
      }
      else{
        alert(data.message);
      }
    });
      };
    
    return(
      <>

        <div className="loginbody">

  <div className="space"></div>
    <div className="provider">
      <form onSubmit={handleSubmit}>
        <div className="logintitle">

          Sign Up

        </div>
      <div className="providerpanel">
         <input type="text" className="logininput" placeholder="Username"  name="username" onChange={Handleform} ></input>
           <input type="email" className="logininput" placeholder="Email" name="email" onChange={Handleform}></input>
         <input type="password" className="logininput" placeholder="Password" name="password" onChange={Handleform}></input>
      </div>
      <input
            id="formSubmit"
            name="clickbutton"
            className="label"
            type="submit"
            value="Sign Up"
          ></input>
          <div className="loginsign2">
          <div className="loginsign">
        
          </div></div>
      </form>
    </div>
        </div></>
    )
}