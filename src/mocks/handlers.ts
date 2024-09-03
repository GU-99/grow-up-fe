import userServiceHandler from '@mocks/services/userServiceHandler';
import teamServiceHandler from '@mocks/services/teamServiceHandler';
import projectServiceHandler from '@mocks/services/projectServiceHandler';
import taskServiceHandler from '@mocks/services/taskServiceHandler';
import authServiceHandler from '@mocks/services/authServiceHandler';

const handlers = [
  ...userServiceHandler,
  ...teamServiceHandler,
  ...projectServiceHandler,
  ...taskServiceHandler,
  ...authServiceHandler,
];

export default handlers;
