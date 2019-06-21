import request from 'axios'

export const getPath = async () => {
  try {
    const response = await request.get('/api/generate-path')
    return response.data.path
  } catch (err) {
    return null
  }
}
