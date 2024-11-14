import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance'; // Ensure this file is properly set up

const Login = () => {
   const navigate = useNavigate();
   const [data, setData] = useState({
      email: "",
      password: "",
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!data?.email || !data?.password) {
         setError("Please fill all fields");
         return;
      }

      setLoading(true);
      setError("");  // Clear previous errors

      axiosInstance.post('/api/user/login', data)
         .then((res) => {
            setLoading(false);
            if (res.data.success) {
               alert(res.data.message);
               localStorage.setItem("token", res.data.token);
               localStorage.setItem("user", JSON.stringify(res.data.userData));
               navigate('/Dashboard');
            } else {
               alert(res.data.message);
            }
         })
         .catch((err) => {
            setLoading(false);
            if (err.response && err.response.status === 401) {
               setError("Invalid credentials or user does not exist");
            } else {
               setError("An error occurred. Please try again.");
            }
         });
   };

   return (
      <>
         <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
               <Navbar.Brand><h2>Study App</h2></Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  </Nav>
                  <Nav>
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className='first-container'>
            <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Box
                  sx={{
                     marginTop: 8,
                     marginBottom: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     padding: '10px',
                     background: '#dddde8db',
                     border: '1px solid lightblue',
                     borderRadius: '5px',
                     width: '100%', // Make sure the form is responsive
                     maxWidth: '400px', // Max width for the form
                  }}
               >
                  <Avatar sx={{ bgcolor: 'secondary.main', marginBottom: 2 }} />
                  <Typography component="h1" variant="h5">
                     Sign In
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     {error && <Typography color="error" variant="body2">{error}</Typography>} {/* Error message */}
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                        required
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                     />
                     <Box mt={2}>
                        <Button
                           type="submit"
                           variant="contained"
                           sx={{ mt: 3, mb: 2 }}
                           style={{ width: '100%' }} // Make button full width
                           disabled={loading}
                        >
                           {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                     </Box>
                     <Grid container>
                        <Grid item>
                           <Typography variant="body2">
                              Don't have an account? 
                              <Link style={{ color: "blue" }} to={'/register'}>
                                 {" Sign Up"}
                              </Link>
                           </Typography>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </div>
      </>
   );
};

export default Login;
