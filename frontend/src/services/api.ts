import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = 'http://localhost:8000' // Adjust based on your backend

// Example API function
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

// Example query hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

// Health check function
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
    refetchInterval: 30000, // Refetch every 30 seconds
  })
} 