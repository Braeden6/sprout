import { useQuery } from '@tanstack/react-query'
import { OpenAPI } from '@/api/generated/core/OpenAPI';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000')

export function initializeApi() {
    OpenAPI.BASE = API_BASE_URL;
    OpenAPI.WITH_CREDENTIALS = true;
    axios.defaults.withCredentials = true;
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

export const fetchHealthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`)
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  return response.json()
}

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealthCheck,
    refetchInterval: 30000,
  })
} 