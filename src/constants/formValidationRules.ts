import Validator from '@utils/Validator';
import { deepFreeze } from '@utils/deepFreeze';
import { EMAIL_REGEX, ID_REGEX, NICKNAME_REGEX, PASSWORD_REGEX, TEAM_NAME_PATTERN } from '@constants/regex';
import { USER_SETTINGS } from '@constants/settings';
import type { Project } from '@/types/ProjectType';
import type { Task } from '@/types/TaskType';

type ValidateOption = { [key: string]: (value: string) => string | boolean };

// ToDo: 리팩토링을 해야하나? 나중에 시간날 때 생각해보기
function getTaskDateValidation(
  projectStartDate: Project['startDate'],
  projectEndDate: Project['endDate'],
  taskStartDate?: Task['startDate'],
) {
  const validation: ValidateOption = {};

  if (taskStartDate) {
    validation.isEarlierDate = (taskEndDate: string) =>
      !Validator.isEarlierStartDate(taskStartDate, taskEndDate) ? '시작일 이후로 설정해주세요.' : true;
  }

  if (projectStartDate && projectEndDate) {
    validation.isWithinDateRange = (taskDate: string) =>
      !Validator.isWithinDateRange(projectStartDate, projectEndDate, taskDate)
        ? '프로젝트 기간 내로 설정해주세요.'
        : true;
  }

  return validation;
}

// ToDo: Form 별로 Validation 분리하기
export const STATUS_VALIDATION_RULES = deepFreeze({
  STATUS_NAME: (nameList: string[]) => ({
    required: '상태명을 입력해주세요.',
    minLength: {
      value: 2,
      message: '상태명을 2자리 이상 20자리 이하로 입력해주세요.',
    },
    maxLength: {
      value: 20,
      message: '상태명을 2자리 이상 20자리 이하로 입력해주세요.',
    },
    validate: {
      isNotEmpty: (value: string) => (Validator.isEmptyString(value) ? '상태명을 제대로 입력해주세요.' : true),
      isNotDuplicatedName: (value: string) =>
        Validator.isDuplicatedName(nameList, value) ? '이미 사용중인 상태명입니다.' : true,
    },
  }),
  COLOR: (colorList: string[]) => ({
    required: '색상을 선택해주세요.',
    validate: {
      isNotDuplicatedName: (value: string) =>
        Validator.isDuplicatedName(colorList, value) ? '이미 사용중인 색상입니다.' : true,
    },
  }),
});

export const USER_AUTH_VALIDATION_RULES = deepFreeze({
  EMAIL: {
    required: '이메일 인증을 진행해 주세요.',
    maxLength: {
      value: USER_SETTINGS.MAX_EMAIL_LENGTH,
      message: `이메일은 최대 ${USER_SETTINGS.MAX_EMAIL_LENGTH}자까지 입력 가능합니다.`,
    },
    pattern: {
      value: EMAIL_REGEX,
      message: '이메일 형식에 맞지 않습니다.',
    },
  },
  VERIFICATION_CODE: { required: '인증번호를 입력해 주세요.' },
  NICKNAME: {
    required: '닉네임을 입력해 주세요.',
    minLength: {
      value: USER_SETTINGS.MIN_NICKNAME_LENGTH,
      message: `닉네임은 최소 ${USER_SETTINGS.MIN_NICKNAME_LENGTH}자 이상이어야 합니다.`,
    },
    maxLength: {
      value: USER_SETTINGS.MAX_NICKNAME_LENGTH,
      message: `닉네임은 최대 ${USER_SETTINGS.MAX_NICKNAME_LENGTH}자까지 입력 가능합니다.`,
    },
    pattern: {
      value: NICKNAME_REGEX,
      message: '닉네임은 영문, 한글, 숫자만 포함 가능합니다.',
    },
  },
  PASSWORD: {
    required: '비밀번호를 입력해 주세요.',
    minLength: {
      value: USER_SETTINGS.MIN_PW_LENGTH,
      message: `비밀번호는 최소 ${USER_SETTINGS.MIN_PW_LENGTH}자 이상이어야 합니다.`,
    },
    maxLength: {
      value: USER_SETTINGS.MAX_PW_LENGTH,
      message: `비밀번호는 최대 ${USER_SETTINGS.MAX_PW_LENGTH}자 이하여야 합니다.`,
    },
    pattern: {
      value: PASSWORD_REGEX,
      message: '영문자, 숫자, 기호를 조합해 비밀번호를 입력해주세요.',
    },
  },
  PASSWORD_CONFIRM: (password: string) => ({
    required: '비밀번호를 한 번 더 입력해 주세요.',
    validate: (value: string) => value === password || '비밀번호가 일치하지 않습니다.',
  }),
  NEW_PASSWORD: (currentPassword: string) => ({
    ...USER_AUTH_VALIDATION_RULES.PASSWORD,
    validate: (value: string) => value !== currentPassword || '신규 비밀번호가 현재 비밀번호와 동일합니다.',
  }),
  ID: {
    required: '아이디를 입력해 주세요.',
    minLength: {
      value: USER_SETTINGS.MIN_ID_LENGTH,
      message: `아이디는 최소 ${USER_SETTINGS.MIN_ID_LENGTH}자 이상이어야 합니다.`,
    },
    maxLength: {
      value: USER_SETTINGS.MAX_ID_LENGTH,
      message: `아이디는 최대 ${USER_SETTINGS.MAX_ID_LENGTH}자 이하여야 합니다.`,
    },
    pattern: {
      value: ID_REGEX,
      message: '아이디는 영문, 한글, 숫자 및 특수기호(., @, _, +, -)만 포함 가능합니다.',
    },
  },
});

export const TASK_VALIDATION_RULES = deepFreeze({
  STATUS: {
    required: '상태를 선택해주세요.',
  },
  TASK_NAME: (nameList: string[]) => ({
    required: '일정명을 입력해주세요.',
    maxLength: {
      value: 128,
      message: '일정명은 128자리 이하로 입력해주세요.',
    },
    validate: {
      isNotEmpty: (name: string) => (Validator.isEmptyString(name) ? '일정명을 제대로 입력해주세요.' : true),
      isNotDuplicatedName: (value: string) =>
        Validator.isDuplicatedName(nameList, value) ? '이미 사용중인 일정명입니다.' : true,
    },
  }),
  START_DATE: (projectStartDate: Project['startDate'], projectEndDate: Project['endDate']) => ({
    required: '시작일을 선택해주세요.',
    validate: getTaskDateValidation(projectStartDate, projectEndDate),
  }),
  END_DATE: (
    hasDeadline: boolean,
    projectStartDate: Project['startDate'],
    projectEndDate: Project['endDate'],
    taskStartDate: Task['startDate'],
  ) => ({
    required: hasDeadline && '종료일을 선택해주세요.',
    validate: getTaskDateValidation(projectStartDate, projectEndDate, taskStartDate),
  }),
});

export const TEAM_VALIDATION_RULES = deepFreeze({
  TEAM_NAME: {
    required: '팀명을 입력해주세요.',
    maxLength: {
      value: 10,
      message: '팀명은 최대 10자리까지 입력 가능합니다.',
    },
    pattern: {
      value: TEAM_NAME_PATTERN,
      message: '팀명은 한글, 영문, 숫자만 포함 가능합니다.',
    },
  },
  TEAM_DESCRIPTION: {
    maxLength: {
      value: 200,
      message: '팀 설명은 최대 200자까지 입력 가능합니다.',
    },
  },
});

export const PROJECT_VALIDATION_RULES = deepFreeze({
  PROJECT_NAME: {
    required: '프로젝트명을 입력해주세요.',
    maxLength: {
      value: 10,
      message: '프로젝트명은 최대 10자리까지 입력 가능합니다.',
    },
    pattern: {
      value: TEAM_NAME_PATTERN,
      message: '프로젝트명은 한글, 영문, 숫자만 포함 가능합니다.',
    },
  },
  PROJECT_DESCRIPTION: {
    maxLength: {
      value: 200,
      message: '프로젝트 설명은 최대 200자까지 입력 가능합니다.',
    },
  },
});
