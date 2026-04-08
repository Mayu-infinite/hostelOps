import axios from "axios"

const BASE_URL = "http://localhost:8000/api/v1"

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export const getAllComplaints = async (token) => {
  const response = await axios.get(`${BASE_URL}/complaints`, authHeaders(token))
  return response.data
}

export const assignWorker = async (id, workerId, token) => {
  const response = await axios.put(
    `${BASE_URL}/complaints/${id}/assign`,
    { worker_id: Number(workerId) },
    authHeaders(token)
  )
  return response.data
}

export const updateStatus = async (id, status, token) => {
  const response = await axios.put(
    `${BASE_URL}/complaints/${id}`,
    { status },
    authHeaders(token)
  )
  return response.data
}
