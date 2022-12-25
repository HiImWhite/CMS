import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ActionButtons from './ActionButtons';
import Title from './Title';
import axios from 'axios';
import {
  createRef,
  uploadImage,
  downloadImage,
  deleteImage,
} from '../../lib/storage';
import { getData } from '../../lib/api';
import { verifyImage } from '../../lib/file-type';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postText, setPostText] = useState('');
  const [newPost, setNewPost] = useState(true);

  const modules = {
    toolbar: [
      // [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const handleUpload = async (e) => {
    console.log(e.target.files[0]);

    try {
      const status = await verifyImage(e.target.files[0]);

      console.log(status);
      if (status !== 'Ok') return;

      const imageFile = e.target.files[0];
      if (!imageFile) return;

      setPostImage(imageFile);
      e.target.value = '';
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setPostTitle('');
    setPostDescription('');
    setPostImage(null);
    setPostText('');
    setNewPost(true);
  };

  const handleNewPost = async (e) => {
    e.preventDefault();

    if (!postTitle || !postDescription || !postImage || !postText) return;

    try {
      const title = postTitle?.toLowerCase().replace(' ', '-');
      const postImagesRef = createRef(`postImages/${title}`);

      if (postImage instanceof File)
        await uploadImage(postImagesRef, postImage);
      const imageUrl = await downloadImage(postImagesRef);

      const data = {
        description: postDescription,
        image: imageUrl,
        text: postText,
        title: postTitle,
      };

      if (newPost)
        await axios.post('http://localhost:8000/api/new-post', data, {
          withCredentials: true,
        });
      else
        await axios.post('http://localhost:8000/api/edit-post', data, {
          withCredentials: true,
        });
    } catch (err) {
      console.log(err);
    }
    setPostTitle('');
    setPostDescription('');
    setPostImage(null);
    setPostText('');
    setNewPost(true);
    // getData();
    await getData('posts', setPosts);
  };

  const handleEditPost = async (e) => {
    setNewPost(false);

    const id = e.currentTarget?.id;
    const postToEdit = posts?.find((post) => post.title === id);
    console.log(postToEdit);
    const image = {
      name: postToEdit.title.toLowerCase().replace(' ', '-'),
      photo: postToEdit.image,
    };

    setPostTitle(postToEdit.title);
    setPostDescription(postToEdit.description);
    setPostImage(image);
    setPostText(postToEdit.text);
  };

  const handleDeletePost = async (e) => {
    try {
      const id = e.currentTarget?.id;

      if (!id) return;
      const postID = id.toLowerCase().replace(' ', '-');

      const data = { id: postID };

      const res = await axios.post(
        'http://localhost:8000/api/delete-post',
        data,
      );

      if (res.status !== 200) return;

      const postImagesRef = createRef(`postImages/${postID}`);
      deleteImage(postImagesRef);
    } catch (err) {
      console.log(err);
    }
    // getData();
    await getData('posts', setPosts);
  };

  // const getData = useCallback(async () => {
  //   try {
  //     const res = await axios.get('http://localhost:8000/api/posts');
  //     const { data } = res;

  //     // const postsData = data?.posts;

  //     if (!data) return;

  //     setPosts(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // useEffect(() => {
  //   getData();
  // }, [getData]);

  useEffect(() => {
    getData('posts', setPosts);
  }, []);

  return (
    <Box
      component='main'
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}>
      <Toolbar />
      <Container maxWidth='lg' sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleNewPost}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
              <Box>
                <Title>Post title</Title>
                <TextField
                  id='set-title'
                  label='Write post title'
                  variant='outlined'
                  disabled={!newPost}
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box>
                <Title>Post description</Title>
                <TextField
                  id='set-description'
                  label='Write post description'
                  variant='outlined'
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Title>Background photo</Title>
                {postImage?.name && (
                  <Box
                    component='img'
                    src={
                      postImage?.photo
                        ? postImage?.photo
                        : URL?.createObjectURL(postImage)
                    }
                    alt={postImage?.name}
                    sx={{
                      objectFit: 'cover',
                      width: '50%',
                      alignSelf: 'center',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  />
                )}
                <Button
                  id='upload-background'
                  variant='contained'
                  component='label'
                  onChange={handleUpload}
                  sx={{
                    alignSelf: 'center',
                    textTransform: 'none',
                  }}>
                  Upload
                  <input hidden accept='image/*' type='file' />
                </Button>
                <Box display='flex' gap={1}>
                  <Typography>Currently uploaded photo:</Typography>
                  <Typography color='GrayText'>
                    {postImage?.name ? postImage?.name : 'none'}
                  </Typography>
                </Box>
              </Box>
              <ReactQuill
                theme='snow'
                value={postText}
                onChange={setPostText}
                placeholder='Write something'
                modules={modules}
              />
              <Box alignSelf='center'>
                <Button
                  variant='outlined'
                  onClick={handleCancel}
                  sx={{
                    mx: '4px',
                    textTransform: 'none',
                  }}>
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  sx={{
                    mx: '4px',
                    textTransform: 'none',
                  }}>
                  {newPost ? 'Add new post' : 'Save edited post'}
                </Button>
              </Box>
              {/* <ActionButtons
                secondTitle={newPost ? 'Add new post' : 'Save edited post'}
                handleCancel={handleCancel}
                handleUpdate={handleNewPost}
              /> */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Title>Created posts</Title>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>Post title</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts?.map((post, i) => (
                    <TableRow key={i}>
                      <TableCell>{i}</TableCell>
                      <TableCell>{post?.title}</TableCell>
                      <TableCell>{post?.date}</TableCell>
                      <TableCell align='center'>
                        <IconButton
                          id={post?.title}
                          onClick={handleEditPost}
                          aria-label='edit post'
                          component='label'>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          id={post?.title}
                          onClick={handleDeletePost}
                          aria-label='delete post'
                          component='label'>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ManagePosts;
