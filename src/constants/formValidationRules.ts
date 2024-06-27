import Validator from '@utils/Validator';
import { deepFreeze } from '@utils/deepFreeze';

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
      isEmpty: (value: string) => !Validator.isEmptyString(value) || '상태명을 제대로 입력해주세요.',
      duplicatedName: (value: string) => !Validator.isDuplicatedName(nameList, value) || '이미 사용중인 상태명입니다.',
    },
  }),
  COLOR: (colorList: string[]) => ({
    required: '색상을 선택해주세요.',
    validate: {
      duplicatedName: (value: string) => !Validator.isDuplicatedName(colorList, value) || '이미 사용중인 색상입니다.',
    },
  }),
});
