import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Sidebar = (props) => {
  const { archives, social } = props;
  console.log(archives);
  const socialProvided = social.some((network) => network.url !== '');

  return (
    <Grid item xs={12} md={4}>
      {archives.length > 0 && (
        <Typography component='h4' variant='h6' gutterBottom>
          Archives
        </Typography>
      )}
      {archives?.map((archive) => (
        <Link
          component={NavLink}
          display='block'
          variant='body1'
          // to={'posts/archives/' + archive.url}
          to={
            'posts/archives/' +
            archive.title?.toLowerCase()?.split(' ')?.join('/')
          }
          key={archive.title}>
          {archive.title}
        </Link>
      ))}
      {socialProvided && (
        <Typography component='h4' variant='h6' gutterBottom sx={{ mt: 3 }}>
          Social
        </Typography>
      )}
      {social.map(
        (network) =>
          network.url && (
            <Link
              component={NavLink}
              display='block'
              variant='body1'
              to={network.url}
              key={network.name}
              sx={{ mb: 0.5 }}>
              <Stack direction='row' spacing={1} alignItems='center'>
                <network.icon />
                <span>{network.name}</span>
              </Stack>
            </Link>
          ),
      )}
    </Grid>
  );
};

Sidebar.propTypes = {
  archives: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      // url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Sidebar;
