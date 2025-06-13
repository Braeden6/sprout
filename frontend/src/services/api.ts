import { OpenAPI } from '@/api/generated/core/OpenAPI';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000')

export function initializeApi() {
    OpenAPI.BASE = API_BASE_URL;
    OpenAPI.WITH_CREDENTIALS = true;
    axios.defaults.withCredentials = true;
    setAuthorizationHeader();
}

export function setAuthorizationHeader() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('session_token')}`;
}