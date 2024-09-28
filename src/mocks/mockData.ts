import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';

import type { UserInfo } from '@/types/UserType';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';
import type { Task } from '@/types/TaskType';
import type { Role } from '@/types/RoleType';

type TeamUser = {
  teamId: number;
  userId: number;
  roleId: number;
  isPendingApproval: boolean;
};

type ProjectUser = {
  projectId: number;
  userId: number;
  roleId: number;
};

type TaskUser = {
  taskId: number;
  userId: number;
};

type TaskFile = {
  fileId: number;
  taskId: number;
  fileName: string;
  fileUrl: string;
};

export const JWT_TOKEN_DUMMY = 'mocked-header.mocked-payload-4.mocked-signature';

export const VERIFICATION_CODE_DUMMY = '1234';
export const TEMP_PASSWORD_DUMMY = '!1p2l3nqlz';

// 사용자 테이블 Mock (사용자 링크 테이블 포함)
export const USER_DUMMY: UserInfo[] = [
  {
    userId: 1,
    username: 'panda_dev',
    password: 'password1',
    email: 'one@naver.com',
    provider: 'GOOGLE',
    nickname: '판다',
    bio: '풀스택 개발자를 목표중',
    links: [],
    profileImageName: null,
  },
  {
    userId: 2,
    username: 'chameleon_design',
    password: 'password2',
    email: 'two@naver.com',
    provider: 'KAKAO',
    nickname: '카멜레온',
    bio: '디자이너 + 프론트엔드 육각형 인재',
    links: [],
    profileImageName: null,
  },
  {
    userId: 3,
    username: 'redpanda_front',
    password: 'password3',
    email: 'three@naver.com',
    provider: 'GOOGLE',
    nickname: '랫서판다',
    bio: '급성장중인 프론트엔드 취준생',
    links: [],
    profileImageName: null,
  },
  {
    userId: 4,
    username: 'polar_bear_front',
    password: 'password4',
    email: 'four@naver.com',
    provider: 'KAKAO',
    nickname: '북금곰',
    bio: '힘을 숨긴 프론트엔드 취준생',
    links: [],
    profileImageName: null,
  },
  {
    userId: 5,
    username: 'tiger_backend',
    password: 'password5',
    email: 'five@naver.com',
    provider: 'KAKAO',
    nickname: '호랑이',
    bio: '백엔드 5년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 6,
    username: 'sloth_fullstack',
    password: 'password6',
    email: 'six@naver.com',
    provider: 'GOOGLE',
    nickname: '나무늘보',
    bio: '식스센스 초감각형 풀스택 개발자',
    links: [],
    profileImageName: null,
  },
  {
    userId: 7,
    username: 'wombat_backend',
    password: 'password7',
    email: 'seven@naver.com',
    provider: 'KAKAO',
    nickname: '웜뱃',
    bio: '초럭키비키 백엔드 개발자',
    links: [],
    profileImageName: null,
  },
  {
    userId: 8,
    username: 'beluga_design',
    password: 'password8',
    email: 'eight@naver.com',
    provider: 'GOOGLE',
    nickname: '벨루가',
    bio: '팔방미인 디자이너',
    links: [],
    profileImageName: null,
  },
  {
    userId: 9,
    username: 'penguin_dba',
    password: 'password9',
    email: 'nine@naver.com',
    provider: 'KAKAO',
    nickname: '펭귄',
    bio: 'MySQL, Postgre SQL DBA',
    links: [],
    profileImageName: null,
  },
  {
    userId: 10,
    username: 'beaver_devops',
    password: 'password10',
    email: 'ten@naver.com',
    provider: 'GOOGLE',
    nickname: '비버',
    bio: 'DevOps 3년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 11,
    username: 'eleven',
    password: 'password11',
    email: 'eleven@naver.com',
    provider: 'LOCAL',
    nickname: '판다아빠',
    bio: '풀스택 개발자 10년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 12,
    username: 'twelve',
    password: 'password12',
    email: 'twelve@naver.com',
    provider: 'LOCAL',
    nickname: '판다엄마',
    bio: '디자이너 10년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 13,
    username: 'thirteen',
    password: 'password13',
    email: 'thirteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다형',
    bio: 'DevOps 2년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 14,
    username: 'fourteen',
    password: 'password14',
    email: 'fourteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다누나',
    bio: 'DBA 2년차',
    links: [],
    profileImageName: null,
  },
  {
    userId: 15,
    username: 'fifteen',
    password: 'password15',
    email: 'fifteen@naver.com',
    provider: 'LOCAL',
    nickname: '판다동생',
    bio: '미래의 슈퍼 개발자',
    links: [],
    profileImageName: null,
  },
  {
    provider: 'LOCAL',
    userId: 16,
    username: 'test123',
    password: 'qwer@1234',
    email: 'momoco@gmail.com',
    nickname: 'momoco',
    profileImageName: null,
    bio: "Hi, I'm Momoco!",
    links: ['momoco@github.com'],
  },
  {
    provider: 'LOCAL',
    userId: 17,
    username: 'brown',
    password: 'test1234!',
    email: 'brown@example.com',
    nickname: '브라운',
    profileImageName: 'Image1.jpg',
    bio: '게임을 좋아하는 개발자',
    links: ['brown@example.com'],
  },
  {
    provider: 'KAKAO',
    userId: 18,
    username: 'cony',
    password: 'test1234!',
    email: 'cony@example.com',
    nickname: '코니',
    profileImageName: 'Image2.png',
    bio: '커피와 책을 사랑하는 디자이너',
    links: ['cony@example.com'],
  },
  {
    provider: 'GOOGLE',
    userId: 19,
    username: 'leonard',
    password: 'test1234!',
    email: 'leonard@example.com',
    nickname: '레너드',
    profileImageName: 'Image3.jpeg',
    bio: '자연을 사랑하는 사진작가',
    links: ['leonard@example.com'],
  },
  {
    provider: 'LOCAL',
    userId: 20,
    username: 'sally',
    password: 'test1234!',
    email: 'sally@example.com',
    nickname: '샐리',
    profileImageName: 'Image1.webp',
    bio: '24시간이 모자란 워커홀릭 개발자',
    links: ['sally@example.com'],
  },
  {
    provider: 'KAKAO',
    userId: 21,
    username: 'james',
    password: 'test1234!',
    email: 'james@example.com',
    nickname: '제임스',
    profileImageName: 'Image2.png',
    bio: '커피를 코드로 바꾸는 마법사',
    links: ['james@example.com'],
  },
  {
    provider: 'GOOGLE',
    userId: 22,
    username: 'edward',
    password: 'test1234!',
    email: 'edward@example.com',
    nickname: '에드워드',
    profileImageName: 'Image3.jpeg',
    bio: '버그를 춤추게 하는 디버깅의 달인',
    links: ['edward@example.com'],
  },
  {
    provider: 'LOCAL',
    userId: 23,
    username: 'mary',
    password: 'test1234!',
    email: 'mary@example.com',
    nickname: '메리',
    profileImageName: 'Image4.jpg',
    bio: '픽셀을 요리하는 디자인 셰프',
    links: ['mary@example.com'],
  },
  {
    provider: 'LOCAL',
    userId: 24,
    username: 'tom',
    password: 'test1234!',
    email: 'tom@example.com',
    nickname: '톰',
    profileImageName: 'Image5.jpeg',
    bio: '알고리즘으로 세상을 정복하려는 꿈나무',
    links: ['tom@example.com'],
  },
];

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
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 3,
    roleId: 2,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 4,
    roleId: 3,
    isPendingApproval: false,
  },
  {
    teamId: 1,
    userId: 8,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 9,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 11,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 12,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 13,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 14,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 1,
    userId: 15,
    roleId: 3,
    isPendingApproval: true,
  },
  // 팀2 소속 유저 정보
  {
    teamId: 2,
    userId: 1,
    roleId: 2,
    isPendingApproval: true,
  },
  {
    teamId: 2,
    userId: 3,
    roleId: 2,
    isPendingApproval: true,
  },
  {
    teamId: 2,
    userId: 4,
    roleId: 1,
    isPendingApproval: true,
  },
  {
    teamId: 2,
    userId: 5,
    roleId: 3,
    isPendingApproval: false,
  },
  {
    teamId: 2,
    userId: 7,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 2,
    userId: 10,
    roleId: 3,
    isPendingApproval: true,
  },
  // 팀3 소속 유저 정보
  {
    teamId: 3,
    userId: 1,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 3,
    userId: 2,
    roleId: 3,
    isPendingApproval: true,
  },
  {
    teamId: 3,
    userId: 5,
    roleId: 2,
    isPendingApproval: false,
  },
  {
    teamId: 3,
    userId: 6,
    roleId: 1,
    isPendingApproval: true,
  },
] as const;

// 팀 테이블 Mock
export const TEAM_DUMMY: Team[] = [
  {
    teamId: 1,
    teamName: 'GU99',
    content: '사이드 프로젝트 팀원 모집 / 프로젝트 관리 서비스 등을 만드는 팀  ',
    creatorId: 1,
  },
  {
    teamId: 2,
    teamName: '오늘볼래',
    content: '모임/이벤트/소개팅 등 사람과 사람을 이어주는 서비스를 만드는 팀',
    creatorId: 4,
  },
  {
    teamId: 3,
    teamName: '고인물',
    content: '게임 리뷰/정보공유/모임 등을 위한 서바스를 개발하고 있는 팀',
    creatorId: 6,
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
  },
  {
    projectId: 2,
    teamId: 1,
    name: 'GrowUp',
    content: '팀원을 모아 프로젝트를 진행하며, 진척도를 관리하는 프로젝트',
    startDate: new Date('2024-05-15 00:00:00'),
    endDate: new Date('2024-09-01  00:00:00'),
  },
  {
    projectId: 3,
    teamId: 2,
    name: 'WithMe',
    content: '이벤트/모임을 등록하여 참여자를 모집하는 프로젝트',
    startDate: new Date('2023-06-05 00:00:00'),
    endDate: new Date('2023-09-12 00:00:00'),
  },
] as const;

// 프로젝트 상태 테이블 Mock
export const STATUS_DUMMY: ProjectStatus[] = [
  // 프로젝트1 상태
  {
    statusId: 1,
    projectId: 1,
    statusName: '할일',
    colorCode: PROJECT_STATUS_COLORS.RED,
    sortOrder: 1,
  },
  {
    statusId: 2,
    projectId: 1,
    statusName: '진행중',
    colorCode: PROJECT_STATUS_COLORS.YELLOW,
    sortOrder: 2,
  },
  {
    statusId: 3,
    projectId: 1,
    statusName: '완료',
    colorCode: PROJECT_STATUS_COLORS.GREEN,
    sortOrder: 3,
  },
  // 프로젝트2 상태
  {
    statusId: 4,
    projectId: 2,
    statusName: '할일',
    colorCode: PROJECT_STATUS_COLORS.RED,
    sortOrder: 1,
  },
  {
    statusId: 5,
    projectId: 2,
    statusName: '진행중',
    colorCode: PROJECT_STATUS_COLORS.YELLOW,
    sortOrder: 2,
  },
  {
    statusId: 6,
    projectId: 2,
    statusName: '완료',
    colorCode: PROJECT_STATUS_COLORS.GREEN,
    sortOrder: 3,
  },
  // 프로젝트3 상태
  {
    statusId: 7,
    projectId: 3,
    statusName: 'To Do',
    colorCode: PROJECT_STATUS_COLORS.YELLOW,
    sortOrder: 1,
  },
  {
    statusId: 8,
    projectId: 3,
    statusName: 'In Progress',
    colorCode: PROJECT_STATUS_COLORS.ORANGE,
    sortOrder: 2,
  },
  {
    statusId: 9,
    projectId: 3,
    statusName: 'In Review',
    colorCode: PROJECT_STATUS_COLORS.RED,
    sortOrder: 3,
  },
  {
    statusId: 10,
    projectId: 3,
    statusName: 'Done',
    colorCode: PROJECT_STATUS_COLORS.BLUE,
    sortOrder: 4,
  },
] as const;

export const TASK_USER_DUMMY: TaskUser[] = [
  {
    taskId: 1,
    userId: 1,
  },
  {
    taskId: 2,
    userId: 3,
  },
  {
    taskId: 3,
    userId: 9,
  },
  {
    taskId: 4,
    userId: 1,
  },
  {
    taskId: 5,
    userId: 3,
  },
  {
    taskId: 6,
    userId: 1,
  },
  {
    taskId: 7,
    userId: 3,
  },
  {
    taskId: 8,
    userId: 9,
  },
];

export const TASK_DUMMY: Task[] = [
  // 프로젝트2 완료 상태
  {
    taskId: 1,
    name: 'task 상태 추가 모달 작업하기',
    sortOrder: 1,
    statusId: 6,
    content: '',
    startDate: '2024-06-22',
    endDate: '2024-06-26',
  },
  {
    taskId: 2,
    name: 'project layout 작성하기',
    sortOrder: 2,
    statusId: 6,
    content: '',
    startDate: '2024-06-21',
    endDate: '2024-06-21',
  },
  {
    taskId: 3,
    name: 'tailwindcss 설정하기',
    sortOrder: 3,
    statusId: 6,
    content: '',
    startDate: '2024-06-14',
    endDate: '2024-06-18',
  },
  // 프로젝트2 진행중 상태
  {
    taskId: 4,
    name: 'API 명세서 작성하기',
    sortOrder: 2,
    statusId: 5,
    content: '',
    startDate: '2024-06-27',
    endDate: '2024-06-29',
  },
  {
    taskId: 5,
    name: 'DnD 기술 조사하기',
    sortOrder: 1,
    statusId: 5,
    content: `# AITalk\n## 주제\nDnD 기술 조사하기\n\n※\`DnD\`란 Drag and Drop의 약자다\n\n## 라이브러리 선정\n[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 등과 같이 다양한 라이브러리 중 어느 것을 선정할 것인가?`,
    startDate: '2024-06-27',
    endDate: '2024-06-29',
  },
  // 프로젝트2 할일 상태
  {
    taskId: 6,
    name: '할일 추가 모달 구현하기',
    sortOrder: 1,
    statusId: 4,
    content: '',
    startDate: '2024-06-26',
    endDate: '2024-07-02',
  },
  {
    taskId: 7,
    name: 'ID 찾기 페이지 작성하기',
    sortOrder: 2,
    statusId: 4,
    content: '',
    startDate: '2024-07-03',
    endDate: '2024-07-05',
  },
  {
    taskId: 8,
    name: 'DnD 구현하기',
    sortOrder: 3,
    statusId: 4,
    content: '',
    startDate: '2024-06-30',
    endDate: '2024-07-02',
  },
];

// ToDo: 파일 업로드, 다운로드 구현시 더미 정보 제대로 채울 것
export const TASK_FILE_DUMMY: TaskFile[] = [
  {
    fileId: 1,
    taskId: 1,
    fileName: '최종본.pdf',
    fileUrl: '',
  },
  {
    fileId: 2,
    taskId: 1,
    fileName: '참고자료.pdf',
    fileUrl: '',
  },
  {
    fileId: 3,
    taskId: 2,
    fileName: '명세서.pdf',
    fileUrl: '',
  },
];
