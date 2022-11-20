import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const FormForgotPass = () => {
  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
          }}>
          Forgot your password?
        </Typography>
        <Typography color='text.secondary'>
          Enter your email address and will send you an message with a link to
          reset your password.
        </Typography>
      </Box>
      <form>
        <Grid container spacing={4}>
          <Grid item xs={12} marginBottom={2}>
            <TextField
              label='Email *'
              variant='outlined'
              name={'email'}
              fullWidth
              value={this.state.email}
              //   onChange={(e: any) => this.handleInputChanges(e)}
              error={this.state.blurErrors.includes('email') ? true : false}
              helperText={
                this.state.blurErrors.includes('email')
                  ? 'Email is required'
                  : ''
              }
            />
          </Grid>
          <Grid item container xs={12}>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent={'space-between'}
              width={'100%'}
              maxWidth={600}
              margin={'0 auto'}>
              <Box marginBottom={{ xs: 1, sm: 0 }}>
                <Button
                  size={'large'}
                  variant={'outlined'}
                  component={Link}
                  href={'/'}>
                  Back to home
                </Button>
              </Box>
              <Button
                sx={{ width: 250 }}
                size={'large'}
                variant={'contained'}
                // onClick={(e: any) => this.handleClick(e)}
                disabled={this.state.action === 'processing' ? true : false}>
                {this.state.action === 'processing'
                  ? 'Processing, please wait...'
                  : 'Click to send message'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FormForgotPass;
