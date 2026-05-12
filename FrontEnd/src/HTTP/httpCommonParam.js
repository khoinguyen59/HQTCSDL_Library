import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000/db-api/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-access-token': localStorage.getItem('token'),
  },
});
