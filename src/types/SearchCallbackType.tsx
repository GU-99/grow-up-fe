import { findUser } from '@services/userService';
import { findUserByTeam } from '@services/teamService';
import { findUserByProject } from '@services/projectService';

export type FetchCallback<T> = T extends (...arg: infer P) => void ? (...arg: P) => Promise<void> : never;

export type AllSearchCallback = {
  type: 'ALL';
  searchCallback: FetchCallback<typeof findUser>;
};

export type TeamSearchCallback = {
  type: 'TEAM';
  searchCallback: FetchCallback<typeof findUserByTeam>;
};

export type ProjectSearchCallback = {
  type: 'PROJECT';
  searchCallback: FetchCallback<typeof findUserByProject>;
};

export type SearchCallback = AllSearchCallback | TeamSearchCallback | ProjectSearchCallback;
