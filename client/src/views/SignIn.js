import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const { signInHandler, rememberSessionUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const theme = createTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formRef = new FormData(e.currentTarget);

    try {
      if (!formRef.get('email') || !formRef.get('password')) return;

      setLoading(true);

      if (!checked) rememberSessionUser();

      const userCredential = await signInHandler(
        formRef.get('email'),
        formRef.get('password'),
      );

      const { user } = userCredential;

      const data = {
        uid: user.uid,
        email: formRef.get('email'),
      };

      const res = await axios.post('http://localhost:8000/api/signin', data, {
        withCredentials: true,
      });

      if (res?.data?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        position='relative'
        display='flex'
        alignItems='center'
        justifyContent='center'
        height='100%'>
        <Grid container component='main' minHeight='calc(100vh - 118px)'>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light'
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square> */}
          <Grid item xs={12} sm={8} md={5}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component='h1' variant='h5'>
                Sign in
              </Typography>
              <Box
                component='form'
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  autoFocus
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color='primary'
                      checked={checked}
                      onChange={handleChange}
                    />
                  }
                  label='Remember me'
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={loading}
                  sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      component={NavLink}
                      to='/forgot-password'
                      variant='body2'>
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link component={NavLink} to='/register' variant='body2'>
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;
