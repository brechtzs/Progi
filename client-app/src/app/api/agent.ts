import axios, {AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { IActivity } from '../models/activity';
import { IUser, IUserFormValues } from '../models/user';

axios.defaults.baseURL = 'https://localhost:44317/api';

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!')
    }
    const {status, data, config} = error.response;
    if (status === 404) {
        history.push('/notfound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }
    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }
    throw error;
})

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url:string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
}

export default {
    Activities,
    User
}