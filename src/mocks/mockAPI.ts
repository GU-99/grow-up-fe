import {
  FILE_DUMMY,
  PROFILE_IMAGE_DUMMY,
  PROJECT_DUMMY,
  PROJECT_USER_DUMMY,
  ROLE_DUMMY,
  STATUS_DUMMY,
  TASK_DUMMY,
  TASK_FILE_DUMMY,
  TASK_USER_DUMMY,
  TEAM_DUMMY,
  TEAM_USER_DUMMY,
  USER_DUMMY,
} from '@mocks/mockData';

import type { Role } from '@/types/RoleType';
import type { EditUserInfoForm, EditUserLinksForm, User } from '@/types/UserType';
import type { Team, TeamInfoForm } from '@/types/TeamType';
import type { Project, ProjectInfoForm } from '@/types/ProjectType';
import type { ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';
import type { Task, TaskUpdateForm } from '@/types/TaskType';
import type {
  ProfileFileForMemory,
  ProjectUser,
  TaskFileForMemory,
  TaskUser,
  TeamUser,
  UploadTaskFile,
} from '@/types/MockType';

/* ===================== 역할(Role) 관련 처리 ===================== */
// 역할 조회
export function findRole(roleId: Role['roleId']) {
  return ROLE_DUMMY.find((role) => role.roleId === roleId);
}

// ToDo: 유저 ID로 조회해야하나, 현재 이름을 넘겨주고 있어서 임시로 만든 조회 방법 수정 필요
export function findRoleByRoleName(roleName: Role['roleName']) {
  return ROLE_DUMMY.find((role) => role.roleName === roleName);
}

/* ===================== 유저(User) 관련 처리 ===================== */
// 유저 조회
export function findUser(userId: User['userId']) {
  return USER_DUMMY.find((user) => user.userId === userId);
}

// 유저 정보 수정
export function updateUserInfo(userId: User['userId'], updatedUserInfo: EditUserInfoForm) {
  const user = findUser(userId);
  if (!user) throw new Error('해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.');

  const { nickname, bio } = updatedUserInfo;
  user.nickname = nickname;
  user.bio = bio;
}

// 유저 링크 수정
export function updateUserLinks(userId: User['userId'], updatedUserLinks: EditUserLinksForm) {
  const user = findUser(userId);
  if (!user) throw new Error('해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.');
  user.links = updatedUserLinks.links;
}

// 유저 프로필 수정
export function updateUserProfile(userId: User['userId'], uploadName: string) {
  const user = findUser(userId);
  if (!user) throw new Error('해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.');
  user.fileName = uploadName;
}

// 유저 프로필 삭제
export function deleteUserProfile(userId: User['userId']) {
  const user = findUser(userId);
  if (!user) throw new Error('해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.');
  user.fileName = null;
}
/* ============= 팀에 연결된 유저(Team User) 관련 처리 ============= */

// 팀 이름 중복 여부 확인 함수 추가
export function findTeamByName(teamName: string) {
  return TEAM_DUMMY.find((team) => team.teamName.toLowerCase() === teamName.toLowerCase());
}

// 팀과 연결된 유저 생성
export function createTeamUser(newTeamUser: TeamUser) {
  TEAM_USER_DUMMY.push(newTeamUser);
}

// 팀과 연결된 유저 조회
export function findTeamUser(teamId: Team['teamId'], userId: User['userId']) {
  return TEAM_USER_DUMMY.find((teamUser) => teamUser.teamId === teamId && teamUser.userId === userId);
}

// 유저가 속한 모든 팀 조회
export function findAllTeamUsersByUserId(userId: User['userId']) {
  return TEAM_USER_DUMMY.filter((teamUser) => teamUser.userId === userId);
}

// 팀에 속한 모든 유저 조회
export function findAllTeamUsersByTeamId(teamId: Team['teamId']) {
  return TEAM_USER_DUMMY.filter((teamUser) => teamUser.teamId === teamId);
}

// 특정 팀 유저 수정
export function updateTeamUser(teamId: Team['teamId'], userId: User['userId'], newRoleId: Role['roleId']) {
  const teamUser = findTeamUser(teamId, userId);
  if (!teamUser) throw new Error('팀원을 찾을 수 없습니다.');
  teamUser.roleId = newRoleId;
}

// 팀 유저 삭제
export function deleteTeamUser(teamId: Team['teamId'], userId: User['userId']) {
  const teamUserIndex = TEAM_USER_DUMMY.findIndex(
    (teamUser) => teamUser.teamId === teamId && teamUser.userId === userId,
  );
  if (teamUserIndex === -1) throw new Error('팀 유저를 찾을 수 없습니다.');
  TEAM_USER_DUMMY.splice(teamUserIndex, 1);
}

// 팀에 속한 모든 팀 유저 삭제
export function deleteAllTeamUser(teamId: Team['teamId']) {
  const filteredTeamUsers = TEAM_USER_DUMMY.filter((teamUser) => teamUser.teamId !== teamId);
  if (TEAM_USER_DUMMY.length !== filteredTeamUsers.length) {
    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);
  }
}

/* ====================== 팀(Team) 관련 처리 ====================== */
// 팀 생성
export function createTeam(newTeam: Team) {
  TEAM_DUMMY.push(newTeam);
}

// 팀 조회
export function findTeam(teamId: Team['teamId']) {
  return TEAM_DUMMY.find((team) => team.teamId === teamId);
}

// 팀 수정
export function updateTeam(teamId: Team['teamId'], updatedTeamInfo: TeamInfoForm) {
  const team = findTeam(teamId);
  if (!team) throw new Error('팀를 찾을 수 없습니다.');

  const { teamName, content } = updatedTeamInfo;
  team.teamName = teamName;
  team.content = content;
}

// 팀 삭제
export function deleteTeam(teamId: Team['teamId']) {
  const teamIndex = TEAM_DUMMY.findIndex((team) => team.teamId === teamId);
  if (teamIndex === -1) throw new Error('팀을 찾을 수 없습니다.');
  TEAM_DUMMY.splice(teamIndex, 1);
}

/* ========= 프로젝트에 연결된 유저(Project User) 관련 처리 ========= */

// 프로젝트와 유저 연결 생성
export function createProjectUser(newProjectUser: ProjectUser) {
  PROJECT_USER_DUMMY.push(newProjectUser);
}

// 프로젝트와 연결된 유저 조회
export function findProjectUser(projectId: Project['projectId'], userId: User['userId']) {
  return PROJECT_USER_DUMMY.find((projectUser) => projectUser.projectId === projectId && projectUser.userId === userId);
}

// 프로젝트의 연결된 모든 유저 조회
export function findAllProjectUser(projectId: Project['projectId']) {
  return PROJECT_USER_DUMMY.filter((projectUser) => projectUser.projectId === projectId);
}

// 프로젝트 유저의 역할 업데이트
export function updateProjectUserRole(
  projectId: Project['projectId'],
  userId: User['userId'],
  newRoleId: Role['roleId'],
) {
  const projectUser = findProjectUser(projectId, userId);
  if (!projectUser) throw new Error('프로젝트 유저를 찾을 수 없습니다.');

  projectUser.roleId = newRoleId;
}

// 프로젝트 유저 삭제
export function deleteProjectUser(projectId: Project['projectId'], userId: User['userId']) {
  const projectUserIndex = PROJECT_USER_DUMMY.findIndex(
    (projectUser) => projectUser.projectId === projectId && projectUser.userId === userId,
  );

  if (projectUserIndex === -1) {
    throw new Error('프로젝트 유저를 찾을 수 없습니다.');
  }

  PROJECT_USER_DUMMY.splice(projectUserIndex, 1);
}

// 특정 유저에 연결된 모든 프로젝트 삭제
export function deleteAllProjectUserByTeamId(teamId: Team['teamId'], userId: User['userId']) {
  const projectIdList = findAllProject(teamId).map((project) => project.projectId);

  const filteredProjectUsers = PROJECT_USER_DUMMY.filter(
    (projectUser) => !(projectIdList.includes(projectUser.projectId) && projectUser.userId === userId),
  );

  if (PROJECT_USER_DUMMY.length !== filteredProjectUsers.length) {
    PROJECT_USER_DUMMY.length = 0;
    PROJECT_USER_DUMMY.push(...filteredProjectUsers);
  }
}

// 프로젝트와 연결된 모든 유저 삭제
export function deleteAllProjectUser(projectId: Project['projectId']) {
  const filteredProjectUsers = PROJECT_USER_DUMMY.filter((projectUser) => projectUser.projectId !== projectId);
  if (PROJECT_USER_DUMMY.length !== filteredProjectUsers.length) {
    PROJECT_USER_DUMMY.length = 0;
    PROJECT_USER_DUMMY.push(...filteredProjectUsers);
  }
}

/* ================= 프로젝트(Project) 관련 처리 ================= */
// 프로젝트 생성
export function createProject(newProject: Project) {
  PROJECT_DUMMY.push(newProject);
}

// 프로젝트 조회
export function findProject(projectId: Project['projectId']) {
  return PROJECT_DUMMY.find((project) => project.projectId === projectId);
}

// 특정 팀의 모든 프로젝트 조회
export function findAllProject(teamId: Team['teamId']) {
  return PROJECT_DUMMY.filter((project) => project.teamId === teamId);
}

// 프로젝트 정보 수정
export function updateProject(projectId: Project['projectId'], updatedProjectInfo: ProjectInfoForm) {
  const project = findProject(projectId);
  if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

  const { projectName, content, startDate, endDate } = updatedProjectInfo;
  project.projectName = projectName;
  project.content = content;
  project.startDate = new Date(startDate);
  project.endDate = endDate ? new Date(endDate) : null;
}

// 프로젝트 삭제
export function deleteProject(projectId: Project['projectId']) {
  const projectIndex = PROJECT_DUMMY.findIndex((project) => project.projectId === projectId);
  if (projectIndex === -1) throw new Error('프로젝트를 찾을 수 없습니다.');
  PROJECT_DUMMY.splice(projectIndex, 1);
}

/* ================ 프로젝트 상태(Status) 관련 처리 ================ */
// 프로젝트 상태 정보 생성
export function createProjectStatus(newStatus: ProjectStatus) {
  STATUS_DUMMY.push(newStatus);
}

// 프로젝트 상태 정보 조회
export function findProjectStatus(statusId: ProjectStatus['statusId']) {
  return STATUS_DUMMY.find((status) => status.statusId === statusId);
}

// 프로젝트의 모든 상태 정보 조회
export function findAllProjectStatus(projectId: Project['projectId']) {
  return STATUS_DUMMY.filter((status) => status.projectId === projectId);
}

// 프로젝트 상태 정보 수정
export function updateProjectStatus(statusId: ProjectStatus['statusId'], newStatusInfo: ProjectStatusForm) {
  const status = findProjectStatus(statusId);
  if (!status) throw new Error('프로젝트 상태를 찾을 수 없습니다.');

  const { statusName, colorCode, sortOrder } = newStatusInfo;
  status.statusName = statusName;
  status.colorCode = colorCode;
  status.sortOrder = sortOrder;
}

// 프로젝트 상태 정보 삭제
export function deleteProjectStatus(statusId: ProjectStatus['statusId']) {
  const statusIndex = STATUS_DUMMY.findIndex((status) => status.statusId === statusId);
  if (statusIndex === -1) throw new Error('프로젝트 상태를 찾을 수 없습니다.');
  STATUS_DUMMY.splice(statusIndex, 1);
}

// 특정 프로젝트의 모든 상태 삭제
export function deleteAllProjectStatus(projectId: Project['projectId']) {
  const filteredStatuses = STATUS_DUMMY.filter((status) => status.projectId !== projectId);
  if (filteredStatuses.length !== STATUS_DUMMY.length) {
    STATUS_DUMMY.length = 0;
    STATUS_DUMMY.push(...filteredStatuses);
  }
}

// 프로젝트 상태 순서 재정렬
export function reorderStatusByProject(projectId: Project['projectId']) {
  STATUS_DUMMY.filter((status) => status.projectId === projectId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((status, index) => {
      status.sortOrder = index + 1;
    });
}

/* ============ 일정에 연결된 유저(Task User) 관련 처리 ============ */
// 일정과 연결된 모든 유저 삭제
export function deleteAllTaskUser(taskId: Task['taskId']) {
  const filteredTaskUsers = TASK_USER_DUMMY.filter((taskUser) => taskUser.taskId !== taskId);
  if (filteredTaskUsers.length !== TASK_USER_DUMMY.length) {
    TASK_USER_DUMMY.length = 0;
    TASK_USER_DUMMY.push(...filteredTaskUsers);
  }
}

// 일정과 특정 유저의 연결만 삭제
export function deleteTaskUser(taskId: Task['taskId'], userId: number) {
  const taskUserIndex = TASK_USER_DUMMY.findIndex(
    (taskUser) => taskUser.taskId === taskId && taskUser.userId === userId,
  );

  if (taskUserIndex !== -1) {
    TASK_USER_DUMMY.splice(taskUserIndex, 1); // 특정 유저와의 연결 삭제
  }
}

/* ===================== 일정(Task) 관련 처리 ===================== */
// 일정 추가
export function createTask(task: Task) {
  TASK_DUMMY.push(task);
}

// 일정 조회
export function findTask(taskId: Task['taskId']) {
  return TASK_DUMMY.find((task) => task.taskId === taskId);
}

// 상태에 포함되는 모든 일정 조회
export function findAllTask(statusId: ProjectStatus['statusId']) {
  return TASK_DUMMY.filter((task) => task.statusId === statusId);
}

// 일정 수정
export function updateTask(taskId: Task['taskId'], newTaskInfo: TaskUpdateForm) {
  const task = findTask(taskId);
  if (!task) throw new Error('일정 정보를 찾을 수 없습니다.');

  const { statusId, taskName, content, startDate, endDate } = newTaskInfo;
  task.statusId = Number(statusId);
  task.taskName = taskName;
  task.content = content;
  task.startDate = startDate;
  task.endDate = endDate;
}

// 일정 삭제
export function deleteTask(taskId: Task['taskId']) {
  const taskIndex = TASK_DUMMY.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('일정 정보를 찾을 수 없습니다.');
  TASK_DUMMY.splice(taskIndex, 1);
}

// 특정 프로젝트의 모든 일정 삭제
export function deleteAllTask(projectId: Project['projectId']) {
  const statusIds = findAllProjectStatus(projectId).map((status) => status.statusId);
  const filteredTasks = TASK_DUMMY.filter((task) => !statusIds.includes(task.statusId));
  if (TASK_DUMMY.length !== filteredTasks.length) {
    TASK_DUMMY.length = 0;
    TASK_DUMMY.push(...filteredTasks);
  }
}

// 일정 수행자 추가
export function createAssignee(assignee: TaskUser) {
  TASK_USER_DUMMY.push(assignee);
}

// 일정 수행자 조회
export function findAssignee(taskId: Task['taskId'], userId: User['userId']) {
  return TASK_USER_DUMMY.find((taskUser) => taskUser.taskId === taskId && taskUser.userId === userId);
}

// 일정의 모든 수행자 조회
export function findAllAssignee(taskId: Task['taskId']) {
  return TASK_USER_DUMMY.filter((taskUser) => taskUser.taskId === taskId);
}

// 일정 수행자 삭제
export function deleteAssignee(taskId: Task['taskId'], userId: User['userId']) {
  const index = TASK_USER_DUMMY.findIndex((taskUser) => taskUser.taskId === taskId && taskUser.userId === userId);
  if (index === -1) throw new Error('수행자를 찾을 수 없습니다.');
  TASK_USER_DUMMY.splice(index, 1);
}

// 일정의 모든 수행자 삭제
export function deleteAllAssignee(taskId: Task['taskId']) {
  const filteredTaskUser = TASK_USER_DUMMY.filter((taskUser) => taskUser.taskId !== taskId);
  if (filteredTaskUser.length !== TASK_USER_DUMMY.length) {
    TASK_USER_DUMMY.length = 0;
    TASK_USER_DUMMY.push(...filteredTaskUser);
  }
}

// 일정 파일 추가
export function createTaskFile(taskFile: UploadTaskFile) {
  TASK_FILE_DUMMY.push(taskFile);
}

// 모든 일정 파일 조회
export function findAllTaskFile(taskId: Task['taskId']) {
  return TASK_FILE_DUMMY.filter((taskFile) => taskFile.taskId === taskId);
}

// 일정 파일 삭제
export function deleteTaskFile(taskId: UploadTaskFile['taskId'], fileId: UploadTaskFile['fileId']) {
  const taskFileIndex = TASK_FILE_DUMMY.findIndex(
    (taskFile) => taskFile.taskId === taskId && taskFile.fileId === fileId,
  );

  if (taskFileIndex === -1) throw new Error('일정 파일을 찾을 수 없습니다.');
  TASK_FILE_DUMMY.splice(taskFileIndex, 1);
}

// 일정의 모든 파일 삭제
export function deleteAllTaskFile(taskId: Task['taskId']) {
  const filteredTaskFile = TASK_FILE_DUMMY.filter((taskFile) => taskFile.taskId !== taskId);
  if (filteredTaskFile.length !== TASK_FILE_DUMMY.length) {
    TASK_FILE_DUMMY.length = 0;
    TASK_FILE_DUMMY.push(...filteredTaskFile);
  }
}

// 특정 상태의 일정 순서 재정렬
export function reorderTaskByStatus(statusId: ProjectStatus['statusId']) {
  TASK_DUMMY.filter((target) => target.statusId === statusId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((task, index) => {
      task.sortOrder = index + 1;
    });
}

/* =============== 업로드 파일 임시 저장 관련 처리 =============== */
// 업로드된 프로필 파일을 메모리 임시 저장
export function saveUserProfileFileInMemory(userId: User['userId'], profileInfo: ProfileFileForMemory) {
  const profileImageIndex = PROFILE_IMAGE_DUMMY.findIndex((user) => user.userId === userId);
  if (profileImageIndex !== -1) {
    PROFILE_IMAGE_DUMMY[profileImageIndex].uploadName = profileInfo.uploadName;
  } else {
    PROFILE_IMAGE_DUMMY.push(profileInfo);
  }
}

// 임시 저장된 프로필 파일 조회
export function downloadProfileFileInMemory(uploadName: ProfileFileForMemory['uploadName']) {
  return PROFILE_IMAGE_DUMMY.find((file) => file.uploadName === uploadName);
}

// 임시 저장된 프로필 파일 삭제
export function deleteProfileFileInMemory(userId: User['userId']) {
  const fileIndex = PROFILE_IMAGE_DUMMY.findIndex((file) => file.userId === userId);
  if (fileIndex === -1) throw new Error('삭제할 프로필 이미지가 없습니다.');
  PROFILE_IMAGE_DUMMY.splice(fileIndex, 1);
}

// 업로드된 일정 파일을 메모리 임시 저장
export function saveTaskFileInMemory(taskFile: TaskFileForMemory) {
  FILE_DUMMY.push(taskFile);
}

// 임시 저장된 일정 파일 다운로드
export function downloadTaskFileInMemory(uploadName: TaskFileForMemory['uploadName']) {
  return FILE_DUMMY.find((file) => file.uploadName === uploadName);
}

// 임시 저장된 일정 파일 삭제
export function deleteTaskFileInMemory(taskId: TaskFileForMemory['taskId'], fileId: TaskFileForMemory['fileId']) {
  const fileIndex = FILE_DUMMY.findIndex((file) => file.taskId === taskId && file.fileId === fileId);

  if (fileIndex === -1) throw new Error('일정 파일(In memory)을 찾을 수 없습니다.');
  FILE_DUMMY.splice(fileIndex, 1);
}

// 임시 저장된 특정 일정의 모든 파일 삭제
export function deleteAllTaskFileInMemory(taskId: TaskFileForMemory['taskId']) {
  const filteredFile = FILE_DUMMY.filter((file) => file.taskId !== taskId);
  if (filteredFile.length !== FILE_DUMMY.length) {
    FILE_DUMMY.length = 0;
    FILE_DUMMY.push(...filteredFile);
  }
}
