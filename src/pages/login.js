import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function login() {
  const [form, setForm] = useState({});
  const Handleform = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();

  const handleSubmit =async(e) => {
      console.log(form)
      e.preventDefault();
      const stat= await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
        method: 'POST',
        crossDomain: true,
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
          Accept : 'application/json',
        },
      
      })
    .then((res)=>res.json())
    .then((data) => {
      console.log(data,"userRgister");
      if(data.status=="success")
      {
        localStorage.setItem("token" ,data.data);
        localStorage.setItem("username" ,form.username);
        router.push("/")
      }
      else{
        alert(data.message);
      }
    });
      }
  return (
    <div className="loginbody">
    <div className="space"></div>
      <div className="provider">
        <div className="logintitle">

         Log In

        </div>
        <form onSubmit={handleSubmit}>
        <div className="providerpanel">
           <input type="text" className="logininput" placeholder="Username"  name="username" onChange={Handleform} ></input>
          <input type="password" className="logininput" placeholder="Password" name="password"onChange={Handleform} ></input>
        </div>
        <input
              id="formSubmit"
              name="clickbutton"
              className="label"
              type="submit"
              value="Login"
            ></input>
            <div className="loginsign2">
            <div className="loginsign">
              Don't have an account?
            <Link href="/signup">  <input
              id="formSubmit1"
              name="clickbutton"
              className="label"
              type="submit"
              value="Sign up"
            ></input></Link>
            </div></div>
        </form>
      </div>
    </div>
  );
}