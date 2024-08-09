import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({
  baseURL: 'https://6eb0-149-102-252-11.ngrok-free.app',
  withCredentials: true,
});

export const socket = io('https://6eb0-149-102-252-11.ngrok-free.app');

export default API;
