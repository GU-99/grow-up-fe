import type { TaskStatus } from '@/types/TaskStatusType';
import type { TaskWithStatus } from '@/types/TaskType';

export const USER_DUMMY = [
  {
    userId: 1,
    email: 'seok@naver.com',
    nickname: '꾸르',
    bio: '풀스택 개발자를 목표중',
  },
  {
    userId: 2,
    email: 'jinju@naver.com',
    nickname: '무드메이커',
    bio: '디자이너 + 프론트엔드 육각형 인재',
  },
  {
    userId: 3,
    email: 'yesol@naver.com',
    nickname: 'SOL천사',
    bio: '프론트엔드 취준생',
  },
];

export const STATUS_DUMMY: TaskStatus[] = [
  {
    statusId: 1,
    name: 'To Do',
    color: '#c83c00',
    order: 1,
  },
  {
    statusId: 2,
    name: 'In Progress',
    color: '#dab700',
    order: 2,
  },
  {
    statusId: 3,
    name: 'Done',
    color: '#237700',
    order: 3,
  },
];

export const TASK_DUMMY: TaskWithStatus[] = [
  {
    statusId: 1,
    name: 'To Do',
    color: '#c83c00',
    order: 1,
    tasks: [
      {
        taskId: 7,
        name: '할일 추가 모달 구현하기',
        order: 1,
        userId: 3,
        files: [],
        startDate: '2024-06-26',
        endDate: '2024-07-02',
      },
      {
        taskId: 8,
        name: 'ID 찾기 페이지 작성하기',
        order: 2,
        userId: 3,
        files: [],
        startDate: '2024-07-03',
        endDate: '2024-07-05',
      },
      {
        taskId: 9,
        name: 'DnD 구현하기',
        order: 3,
        userId: 1,
        files: [],
        startDate: '2024-06-30',
        endDate: '2024-07-02',
      },
    ],
  },
  {
    statusId: 2,
    name: 'In Progress',
    color: '#dab700',
    order: 2,
    tasks: [
      {
        taskId: 5,
        name: 'DnD 기술 조사하기',
        order: 1,
        userId: 1,
        files: [],
        startDate: '2024-06-27',
        endDate: '2024-06-29',
      },
      {
        taskId: 4,
        name: 'API 명세서 작성하기',
        order: 2,
        userId: 2,
        files: [],
        startDate: '2024-06-27',
        endDate: '2024-06-29',
      },
    ],
  },
  {
    statusId: 3,
    name: 'Done',
    color: '#237700',
    order: 3,
    tasks: [
      {
        taskId: 1,
        name: 'task 상태 추가 모달 작업하기',
        order: 1,
        userId: 2,
        files: [],
        startDate: '2024-06-22',
        endDate: '2024-06-26',
      },
      {
        taskId: 2,
        name: 'project layout 작성하기',
        order: 2,
        userId: 1,
        files: [],
        startDate: '2024-06-18',
        endDate: '2024-06-21',
      },
      {
        taskId: 3,
        name: 'tailwindcss 설정하기',
        order: 3,
        userId: 3,
        files: [],
        startDate: '2024-06-14',
        endDate: '2024-06-18',
      },
    ],
  },
];
