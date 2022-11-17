const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoute');

require('dotenv').config();

// app
const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use('/api', authRoutes);

app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}`),
);
