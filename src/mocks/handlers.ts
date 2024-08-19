import userServiceHandler from '@mocks/services/userServiceHandler';
import teamServiceHandler from '@mocks/services/teamServiceHandler';
import projectServiceHandler from '@mocks/services/projectServiceHandler';

const handlers = [...userServiceHandler, ...teamServiceHandler, ...projectServiceHandler];

export default handlers;
