import {
  FILE_DUMMY,
  PROJECT_DUMMY,
  PROJECT_USER_DUMMY,
  ROLE_DUMMY,
  STATUS_DUMMY,
  TASK_DUMMY,
  TASK_FILE_DUMMY,
  TASK_USER_DUMMY,
  USER_DUMMY,
} from '@mocks/mockData';

import type { Role } from '@/types/RoleType';
import type { User } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';
import type { Task, TaskUpdateForm } from '@/types/TaskType';
import type { TaskFileForMemory, TaskUser, UploadTaskFile } from '@/types/MockType';

/* ===================== 역할(Role) 관련 처리 ===================== */

// 역할 조회
export function findRole(roleId: Role['roleId']) {
  return ROLE_DUMMY.find((role) => role.roleId === roleId);
}

/* ===================== 유저(User) 관련 처리 ===================== */

// 유저 조회
export function findUser(userId: User['userId']) {
  return USER_DUMMY.find((user) => user.userId === userId);
}

/* ============= 프로젝트 유저(Project User) 관련 처리 ============= */

// 프로젝트 유저 조회
export function findProjectUser(projectId: Project['projectId'], userId: User['userId']) {
  return PROJECT_USER_DUMMY.find((projectUser) => projectUser.projectId === projectId && projectUser.userId === userId);
}

/* ================= 프로젝트(Project ) 관련 처리 ================= */

// 프로젝트 조회
export function findProject(projectId: Project['projectId']) {
  return PROJECT_DUMMY.find((project) => project.projectId === projectId);
}

/* ================ 프로젝트 상태(Status) 관련 처리 ================ */

// 상태 정보 조회
export function findProjectStatus(statusId: ProjectStatus['statusId']) {
  return STATUS_DUMMY.find((status) => status.statusId === statusId);
}

// 프로젝트의 모든 상태 정보 조회
export function findAllProjectStatus(projectId: Project['projectId']) {
  return STATUS_DUMMY.filter((status) => status.projectId === projectId);
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
export function updateTask(taskId: Task['taskId'], taskInfoData: TaskUpdateForm) {
  const taskIndex = TASK_DUMMY.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('일정 정보를 찾을 수 없습니다.');
  TASK_DUMMY[taskIndex] = { ...TASK_DUMMY[taskIndex], ...taskInfoData, statusId: Number(taskInfoData.statusId) };
}

// 일정 삭제
export function deleteTask(taskId: Task['taskId']) {
  const taskIndex = TASK_DUMMY.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('일정 정보를 찾을 수 없습니다.');
  TASK_DUMMY.splice(taskIndex, 1);
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