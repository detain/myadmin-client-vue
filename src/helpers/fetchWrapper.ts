import { useAuthStore } from '@/stores/auth.store';

export const fetchWrapper = {
    delete: request('DELETE'),
    get: request('GET'),
    patch: requestHasBody('PATCH'),
    post: requestHasBody('POST'),
    put: requestHasBody('PUT'),
};

function requestHasBody(method: string) {
    return (url: string, body?: any) => {
        console.log(`sending a ${method} request to ${url}`);
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

function request(method: string) {
    return (url: string) => {
        console.log(`sending a ${method} request to ${url}`);
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
    // return auth header with jwt if user is logged-in and request is to the api url
    const { user, apiKey, sessionId } = useAuthStore();
    //console.log("session id:");
    //console.log(sessionId);
    const isSessionIdLoggedIn = !!sessionId;
    const isApiKeyLoggedIn = !!apiKey;
    const isLoggedIn = isSessionIdLoggedIn || isApiKeyLoggedIn;
    const isApiUrl = url.match('/apiv2/') != null;
    if (isSessionIdLoggedIn && isApiUrl) {
        //return { Authorization: `Bearer ${user.sessionid}` }
        return { sessionid: `${sessionId}` };
    } else if (isApiKeyLoggedIn && isApiUrl) {
        return { 'X-API-KEY': `${apiKey}` };
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
