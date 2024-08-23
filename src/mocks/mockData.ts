import type { User } from '@/types/UserType';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';
import type { TaskListWithStatus } from '@/types/TaskType';
import type { Role } from '@/types/RoleType';

type TeamUser = {
  teamId: number;
  userId: number;
  roleId: number;
  regStatus: boolean;
};

type ProjectUser = {
  projectId: number;
  userId: number;
  roleId: number;
};

export const JWT_TOKEN_DUMMY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const USER_INFO_DUMMY = {
  provider: 'LOCAL',
  userId: 1,
  id: 'test123',
  email: 'momoco@gmail.com',
  nickname: 'momoco',
  profileUrl: '',
  bio: "Hi, I'm Momoco!",
  links: ['momoco@github.com'],
};

// 사용자 테이블 Mock (사용자 링크 테이블 포함)
export const USER_DUMMY: User[] = [
  {
    userId: 1,
    id: null,
    email: 'one@naver.com',
    provider: 'GOOGLE',
    nickname: '판다',
    bio: '풀스택 개발자를 목표중',
    links: [],
    profileUrl: null,
  },
  {
    userId: 2,
    id: null,
    email: 'two@naver.com',
    provider: 'KAKAO',
    nickname: '카멜레온',
    bio: '디자이너 + 프론트엔드 육각형 인재',
    links: [],
    profileUrl: null,
  },
  {
    userId: 3,
    id: null,
    email: 'three@naver.com',
    provider: 'GOOGLE',
    nickname: '랫서판다',
    bio: '급성장중인 프론트엔드 취준생',
    links: [],
    profileUrl: null,
  },
  {
    userId: 4,
    id: null,
    email: 'four@naver.com',
    provider: 'KAKAO',
    nickname: '북금곰',
    bio: '힘을 숨긴 프론트엔드 취준생',
    links: [],
    profileUrl: null,
  },
  {
    userId: 5,
    id: null,
    email: 'five@naver.com',
    provider: 'KAKAO',
    nickname: '호랑이',
    bio: '백엔드 5년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 6,
    id: null,
    email: 'six@naver.com',
    provider: 'GOOGLE',
    nickname: '나무늘보',
    bio: '식스센스 초감각형 풀스택 개발자',
    links: [],
    profileUrl: null,
  },
  {
    userId: 7,
    id: null,
    email: 'seven@naver.com',
    provider: 'KAKAO',
    nickname: '웜뱃',
    bio: '초럭키비키 백엔드 개발자',
    links: [],
    profileUrl: null,
  },
  {
    userId: 8,
    id: null,
    email: 'eight@naver.com',
    provider: 'GOOGLE',
    nickname: '벨루가',
    bio: '팔방미인 디자이너',
    links: [],
    profileUrl: null,
  },
  {
    userId: 9,
    id: null,
    email: 'nine@naver.com',
    provider: 'KAKAO',
    nickname: '펭귄',
    bio: 'MySQL, Postgre SQL DBA',
    links: [],
    profileUrl: null,
  },
  {
    userId: 10,
    id: null,
    email: 'ten@naver.com',
    provider: 'GOOGLE',
    nickname: '비버',
    bio: 'DevOps 3년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 11,
    id: 'eleven',
    email: 'eleven@naver.com',
    provider: 'LOCAL',
    nickname: '판다아빠',
    bio: '풀스택 개발자 10년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 12,
    id: 'twelve',
    email: 'twelve@naver.com',
    provider: 'LOCAL',
    nickname: '판다엄마',
    bio: '디자이너 10년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 13,
    id: 'thirteen',
    email: 'thirteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다형',
    bio: 'DevOps 2년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 14,
    id: 'fourteen',
    email: 'fourteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다누나',
    bio: 'DBA 2년차',
    links: [],
    profileUrl: null,
  },
  {
    userId: 15,
    id: 'fifteen',
    email: 'fifteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다동생',
    bio: '미래의 슈퍼 개발자',
    links: [],
    profileUrl: null,
  },
] as const;

// 역할 테이블 Mock
export const ROLE_DUMMY: Role[] = [
  {
    roleId: 1,
    roleName: 'HEAD',
    roleType: 'TEAM',
  },
  {
    roleId: 2,
    roleName: 'LEADER',
    roleType: 'TEAM',
  },
  {
    roleId: 3,
    roleName: 'MATE',
    roleType: 'TEAM',
  },
  {
    roleId: 4,
    roleName: 'ADMIN',
    roleType: 'PROJECT',
  },
  {
    roleId: 5,
    roleName: 'LEADER',
    roleType: 'PROJECT',
  },
  {
    roleId: 6,
    roleName: 'ASSIGNEE',
    roleType: 'PROJECT',
  },
] as const;

// 팀 유저 테이블 Mock
export const TEAM_USER_DUMMY: TeamUser[] = [
  {
    teamId: 1,
    userId: 1,
    roleId: 1,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 3,
    roleId: 1,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 4,
    roleId: 3,
    regStatus: false,
  },
  {
    teamId: 1,
    userId: 8,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 9,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 11,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 12,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 13,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 14,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 1,
    userId: 15,
    roleId: 3,
    regStatus: true,
  },
  // 팀2 소속 유저 정보
  {
    teamId: 2,
    userId: 3,
    roleId: 2,
    regStatus: true,
  },
  {
    teamId: 2,
    userId: 4,
    roleId: 1,
    regStatus: true,
  },
  {
    teamId: 2,
    userId: 5,
    roleId: 3,
    regStatus: false,
  },
  {
    teamId: 2,
    userId: 7,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 2,
    userId: 10,
    roleId: 3,
    regStatus: true,
  },
  // 팀3 소속 유저 정보
  {
    teamId: 3,
    userId: 1,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 3,
    userId: 2,
    roleId: 3,
    regStatus: true,
  },
  {
    teamId: 3,
    userId: 5,
    roleId: 2,
    regStatus: false,
  },
  {
    teamId: 3,
    userId: 6,
    roleId: 1,
    regStatus: true,
  },
] as const;

// 팀 테이블 Mock
export const TEAM_DUMMY: Team[] = [
  {
    teamId: 1,
    name: 'GU99',
    content: '사이드 프로젝트 팀원 모집 / 프로젝트 관리 서비스 등을 만드는 팀',
  },
  {
    teamId: 2,
    name: '오늘볼래',
    content: '모임/이벤트/소개팅 등 사람과 사람을 이어주는 서비스를 만드는 팀',
  },
  {
    teamId: 3,
    name: '고인물',
    content: '게임 리뷰/정보공유/모임 등을 위한 서바스를 개발하고 있는 팀',
  },
] as const;

// 프로젝트 유저 테이블 Mock
export const PROJECT_USER_DUMMY: ProjectUser[] = [
  // 프로젝트1 소속 유저 정보
  {
    projectId: 1,
    userId: 1,
    roleId: 4,
  },
  {
    projectId: 1,
    userId: 3,
    roleId: 5,
  },
  {
    projectId: 1,
    userId: 8,
    roleId: 6,
  },
  {
    projectId: 1,
    userId: 11,
    roleId: 5,
  },
  {
    projectId: 1,
    userId: 12,
    roleId: 6,
  },
  {
    projectId: 1,
    userId: 13,
    roleId: 6,
  },
  {
    projectId: 1,
    userId: 14,
    roleId: 6,
  },
  {
    projectId: 1,
    userId: 15,
    roleId: 6,
  },
  // 프로젝트2 소속 유저 정보
  {
    projectId: 2,
    userId: 1,
    roleId: 4,
  },
  {
    projectId: 2,
    userId: 3,
    roleId: 5,
  },
  // 프로젝트3 소속 유저 정보
  {
    projectId: 2,
    userId: 9,
    roleId: 6,
  },
  {
    projectId: 3,
    userId: 3,
    roleId: 5,
  },
  {
    projectId: 3,
    userId: 4,
    roleId: 4,
  },
  {
    projectId: 3,
    userId: 7,
    roleId: 6,
  },
  {
    projectId: 3,
    userId: 10,
    roleId: 6,
  },
];

// 프로젝트 테이블 Mock
export const PROJECT_DUMMY: Project[] = [
  {
    projectId: 1,
    teamId: 1,
    name: 'AITalk',
    content: '상담용 챗봇을 만드는 프로젝트',
    startDate: null,
    endDate: null,
    createAt: new Date('2023-11-01'),
    updateAt: new Date('2023-11-01'),
  },
  {
    projectId: 2,
    teamId: 1,
    name: 'GrowUp',
    content: '팀원을 모아 프로젝트를 진행하며, 진척도를 관리하는 프로젝트',
    startDate: new Date('2024-05-15 00:00:00'),
    endDate: new Date('2024-09-01  00:00:00'),
    createAt: new Date('2024-05-15'),
    updateAt: new Date('2025-05-15'),
  },
  {
    projectId: 3,
    teamId: 2,
    name: 'WithMe',
    content: '이벤트/모임을 등록하여 참여자를 모집하는 프로젝트',
    startDate: new Date('2023-06-05 00:00:00'),
    endDate: new Date('2023-09-12 00:00:00'),
    createAt: new Date('2023-06-05'),
    updateAt: new Date('2023-06-05'),
  },
] as const;

// 프로젝트 상태 테이블 Mock
// ToDo: 프로젝트 상태 테이블용 더미 데이터 변경 필요
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
] as const;

// 특수 케이스: 할일 목록을 프로젝트 상태별로 정리하여 내려준 Mock
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
        content: '',
        files: [],
        startDate: '2024-06-26',
        endDate: '2024-07-02',
      },
      {
        taskId: 8,
        name: 'ID 찾기 페이지 작성하기',
        order: 2,
        userId: 3,
        content: '',
        files: [],
        startDate: '2024-07-03',
        endDate: '2024-07-05',
      },
      {
        taskId: 9,
        name: 'DnD 구현하기',
        order: 3,
        userId: 1,
        content: '',
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
        content: '',
        files: [],
        startDate: '2024-06-27',
        endDate: '2024-06-29',
      },
      {
        taskId: 4,
        name: 'API 명세서 작성하기',
        order: 2,
        userId: 2,
        content: '',
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
        content: '',
        files: [],
        startDate: '2024-06-22',
        endDate: '2024-06-26',
      },
      {
        taskId: 2,
        name: 'project layout 작성하기',
        order: 2,
        userId: 1,
        content: '',
        files: [],
        startDate: '2024-06-18',
        endDate: '2024-06-21',
      },
      {
        taskId: 3,
        name: 'tailwindcss 설정하기',
        order: 3,
        userId: 3,
        content: '',
        files: [],
        startDate: '2024-06-14',
        endDate: '2024-06-18',
      },
    ],
  },
] as const;
