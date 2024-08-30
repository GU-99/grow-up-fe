import userServiceHandler from '@mocks/services/userServiceHandler';
import teamServiceHandler from '@mocks/services/teamServiceHandler';
import projectServiceHandler from '@mocks/services/projectServiceHandler';
import taskServiceHandler from '@mocks/services/taskServiceHandler';
import statusServiceHandler from '@mocks/services/statusServiceHandler';

const handlers = [
  ...userServiceHandler,
  ...teamServiceHandler,
  ...projectServiceHandler,
  ...taskServiceHandler,
  ...statusServiceHandler,
];

export default handlers;
