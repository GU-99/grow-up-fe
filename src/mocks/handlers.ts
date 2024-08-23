import userServiceHandler from '@mocks/services/userServiceHandler';
import teamServiceHandler from '@mocks/services/teamServiceHandler';
import projectServiceHandler from '@mocks/services/projectServiceHandler';
import authServiceHandler from './services/authServiceHandler';

const handlers = [...userServiceHandler, ...teamServiceHandler, ...projectServiceHandler, ...authServiceHandler];

export default handlers;
