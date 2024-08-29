import userServiceHandler from '@mocks/services/userServiceHandler';
import teamServiceHandler from '@mocks/services/teamServiceHandler';
import projectServiceHandler from '@mocks/services/projectServiceHandler';
import taskServiceHandler from '@mocks/services/taskServiceHandler';

const handlers = [...userServiceHandler, ...teamServiceHandler, ...projectServiceHandler, ...taskServiceHandler];

export default handlers;
