import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: requestGet('GET'),
    post: request('POST'),
    put: request('PUT'),
    patch: request('PATCH'),
    delete: request('DELETE'),
};

function request(method: string) {
    return (url: string, body?: any) => {
        const requestOptions: any = {
            method,
            headers: authHeader(url),
        };
        requestOptions.headers['Content-Type'] = 'application/json';
        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse);
    };
}

function requestGet(method) {
    return (url) => {
        const requestOptions = {
            method,
            headers: authHeader(url),
        };
        requestOptions.headers['Content-Type'] = 'application/json';
        return fetch(url, requestOptions).then(handleResponse);
    };
}

// helper functions
function authHeader(url: string): any {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.sessionid;
    const isApiUrl = url.match('/apiv2/') != null;
    if (isLoggedIn && isApiUrl) {
        //return { Authorization: `Bearer ${user.sessionid}` }
        return { sessionid: `${user.sessionid}` };
    } else {
        return {};
    }
}

async function handleResponse(response: any) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;
    // check for error response
    if (!response.ok) {
        const authStore = useAuthStore();
        if ([401, 403].includes(response.status) && authStore.user) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            await authStore.logout();
        }
        console.log(data);
        // get error message from body or default to response status
        //const error = (data && data.message) || response.status
        return Promise.reject(data);
        //return Promise.reject(error)
    }
    return data;
}
