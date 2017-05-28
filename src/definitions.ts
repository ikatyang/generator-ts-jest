import * as dashify from 'dashify';
import {get_git_info} from './utils';

export interface Answers {
  project_name: string;
  project_description: string;
  project_keywords: any;
  github_username: string;
  user_name: string;
  user_email: string;
  tslint_config_preset: string;
  node_version: string;
  source_directory: string;
  generated_directory: string;
  use_yarn: boolean;
  use_exact_version: boolean;
}

export type Fields = Answers & {
  project_keywords: string[];
  tsconfig_target: string;
  node_versions: string[];
  github_profile: string;
  github_repository: string;
};

export const get_dependencies = (fields: Fields) => [
  '@types/jest',
  'codecov',
  'jest',
  'ts-jest',
  'tslint',
  fields.tslint_config_preset,
  'typescript',
];

export const get_questions = (appname: string) => [
  {
    type: 'input',
    name: 'project_name',
    message: 'Project Name',
    default: dashify(appname),
  },
  {
    type: 'input',
    name: 'project_description',
    message: 'Project Description',
  },
  {
    type: 'input',
    name: 'project_keywords',
    message: 'Project Keywords',
  },
  {
    type: 'input',
    name: 'user_name',
    message: 'User Name',
    default: get_git_info('user.name'),
  },
  {
    type: 'input',
    name: 'user_email',
    message: 'User Email',
    default: get_git_info('user.email'),
  },
  {
    type: 'input',
    name: 'github_username',
    message: 'GitHub Username',
    default: get_git_info('user.name'),
  },
  {
    type: 'input',
    name: 'tslint_config_preset',
    message: 'TSLint Config Preset',
    default: 'tslint-config-ikatyang',
  },
  {
    type: 'list',
    name: 'node_version',
    message: 'Target Node Version',
    default: '6',
    choices: [
      '4',
      '6',
    ],
  },
  {
    type: 'input',
    name: 'source_directory',
    message: 'Source Directory',
    default: 'src',
  },
  {
    type: 'input',
    name: 'generated_directory',
    message: 'Generated Directory',
    default: 'lib',
  },
  {
    type: 'confirm',
    name: 'use_yarn',
    message: 'Use Yarn',
    default: true,
  },
  {
    type: 'confirm',
    name: 'use_exact_version',
    message: 'Use exact version',
    default: true,
  },
];
