import { useAuthStore } from '@/stores'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  patch: request('PATCH'),
  delete: request('DELETE')
}

function request(method) {
  return (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url)
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore()
  const isLoggedIn = !!user?.sessionid
  const isApiUrl = url.match('/apiv2/') != null
  if (isLoggedIn && isApiUrl) {
    //return { Authorization: `Bearer ${user.sessionid}` }
    return { sessionid: `${user.sessionid}` }
  } else {
    return {}
  }
}

async function handleResponse(response) {
  const isJson = response.headers?.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null
  // check for error response
  if (!response.ok) {
    const { user, logout } = useAuthStore()
    if ([401, 403].includes(response.status) && user) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      logout()
    }
    console.log(data);

    // get error message from body or default to response status
    //const error = (data && data.message) || response.status
    return Promise.reject(data)
    //return Promise.reject(error)
  }

  return data
}
