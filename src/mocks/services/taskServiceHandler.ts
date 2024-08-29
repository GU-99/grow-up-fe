import { http, HttpResponse } from 'msw';
import { STATUS_DUMMY, TASK_DUMMY } from '@mocks/mockData';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const taskServiceHandler = [
  http.get(`${BASE_URL}/project/:projectId/task`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId));
    const statusTaskList = statusList.map((status) => {
      const tasks = TASK_DUMMY.filter((task) => task.statusId === status.statusId);
      return { ...status, tasks };
    });

    return HttpResponse.json(statusTaskList);
  }),
];

export default taskServiceHandler;
