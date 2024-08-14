import type { ProjectStatus } from '@/types/ProjectStatusType';
import { Project } from '@/types/ProjectType';
import type { TaskListWithStatus } from '@/types/TaskType';
import { Team } from '@/types/TeamType';

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

export const USER_INFO_DUMMY = {
  userId: 1,
  email: 'momoco@gmail.com',
  nickname: 'momoco',
  image: '',
  bio: "Hi, I'm Momoco!",
  link: ['momoco@github.com'],
};

export const TEAM_DUMMY: Team[] = [
  {
    teamId: 1,
    name: 'Grow Up',
    content: '프로젝트 관리 사이드 프로젝트 진행중!',
  },
  {
    teamId: 2,
    name: 'With Me',
    content: '모임 / 이벤트 관리 프로젝트',
  },
  {
    teamId: 3,
    name: 'Game World',
    content: '게임 리뷰 / 정보 공유 프로젝트',
  },
];

export const PROJECT_DUMMY: Project[] = [
  {
    projectId: 1,
    teamId: 1,
    name: '캘린더 만들기1',
    content: '캘린더 만들기 설명1',
    startDate: new Date('2022-01-01 00:00:00'),
    endDate: new Date('2022-02-14 00:00:00'),
    createAt: new Date('2022-01-01'),
    updateAt: new Date('2022-01-01'),
  },
  {
    projectId: 2,
    teamId: 1,
    name: '캘린더 만들기2',
    content: '캘린더 만들기 설명2',
    startDate: new Date('2022-05-12 00:00:00'),
    endDate: new Date('2022-07-31 00:00:00'),
    createAt: new Date('2022-05-12'),
    updateAt: new Date('2022-06-01'),
  },
  {
    projectId: 3,
    teamId: 1,
    name: '캘린더 만들기3',
    content: '캘린더 만들기 설명3',
    startDate: new Date('2023-02-05 00:00:00'),
    endDate: new Date('2023-06-05 00:00:00'),
    createAt: new Date('2023-02-05'),
    updateAt: new Date('2023-02-05'),
  },
  {
    projectId: 4,
    teamId: 1,
    name: '캘린더 만들기4',
    content: '캘린더 만들기 설명4',
    startDate: new Date('2023-04-25 00:00:00'),
    endDate: new Date('2023-06-05 00:00:00'),
    createAt: new Date('2023-04-25'),
    updateAt: new Date('2023-04-25'),
  },
  {
    projectId: 5,
    teamId: 1,
    name: '캘린더 만들기5',
    content: '캘린더 만들기 설명5',
    startDate: new Date('2023-06-05 00:00:00'),
    endDate: new Date('2023-09-12 00:00:00'),
    createAt: new Date('2023-06-05'),
    updateAt: new Date('2023-06-05'),
  },
  {
    projectId: 6,
    teamId: 1,
    name: '캘린더 만들기6',
    content: '캘린더 만들기 설명6',
    startDate: null,
    endDate: null,
    createAt: new Date('2023-07-30'),
    updateAt: new Date('2023-07-30'),
  },
  {
    projectId: 7,
    teamId: 1,
    name: '캘린더 만들기7',
    content: '캘린더 만들기 설명7',
    startDate: null,
    endDate: null,
    createAt: new Date('2023-09-25'),
    updateAt: new Date('2023-09-25'),
  },
  {
    projectId: 8,
    teamId: 1,
    name: '캘린더 만들기8',
    content: '캘린더 만들기 설명8',
    startDate: null,
    endDate: null,
    createAt: new Date('2023-11-01'),
    updateAt: new Date('2023-11-01'),
  },
  {
    projectId: 9,
    teamId: 1,
    name: '캘린더 만들기9',
    content: '캘린더 만들기 설명9',
    startDate: new Date('2024-01-01 00:00:00'),
    endDate: new Date('2025-01-01  00:00:00'),
    createAt: new Date('2024-01-01'),
    updateAt: new Date('2024-07-16'),
  },
  {
    projectId: 10,
    teamId: 1,
    name: '캘린더 만들기10',
    content: '캘린더 만들기 설명10',
    startDate: new Date('2024-05-15 00:00:00'),
    endDate: new Date('2024-09-01  00:00:00'),
    createAt: new Date('2024-05-15'),
    updateAt: new Date('2025-05-15'),
  },
];

export const STATUS_DUMMY: ProjectStatus[] = [
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

export const TASK_DUMMY: TaskListWithStatus[] = [
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
