import React, { useState, useEffect } from 'react';
import { Button, TextField, InputLabel } from '@mui/material';

export default function Contact() {
  const [form, setForm] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (window && localStorage) {
      if (localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'));
      }
    }
  }, []);

  const Handleform = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(form);
    if (!form || !form.subject || form.subject === '') 
    {
      alert("Please fill the form");
      return
    };

    const cont=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/contact`, {
      method: 'POST',
      crossDomain: true,
      body: JSON.stringify({ ...form, token: token }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'Your query is send') {
          console.log('Query sent');
        }  
        else alert(data.message);
      })
      .catch((error) => {
        console.log('Error occurred:', error);
      });
    setForm({ username: '', email: '', subject: '', message: '' })
  };

  return (
    <div className="contact">
      <h1 className="contact-title">Contact Us</h1>
      <form onSubmit={handleSubmit} className="container-form">
        <InputLabel htmlFor="name">Username:</InputLabel>
        <TextField
          id="username"
          variant="outlined"
          name="username"
          value={form.username}
          onChange={(e) => {
            Handleform(e);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: '10px' }}
        />
        <InputLabel htmlFor="email">Email:</InputLabel>
        <TextField
          id="email"
          variant="outlined"
          name='email'
          value={form.email}
          onChange={(e) => {
            Handleform(e);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: '10px' }}
        />

        <InputLabel htmlFor="subject">Subject:</InputLabel>
        <TextField
          id="subject"
          variant="outlined"
          name="subject"
          value={form.subject}
          onChange={(e) => {
            Handleform(e);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: '10px' }}
        />

        <InputLabel htmlFor="message">Message:</InputLabel>
        <TextField
          id="message"
          variant="outlined"
          multiline
          rows={4}
          name="message"
          value={form.message}
          onChange={(e) => {
            Handleform(e);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: '10px' }}
        />

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>

      <div className="contact-info">
        <h2>Contact Information</h2>
        <p>Email: sinhashaket8102@gmail.com</p>
        <p>Phone: +91 6205053781</p>
        <p>Address: BIT MESRA, RANCHI, INDIA</p>
      </div>
    </div>
  );
}
