import dashify = require('lodash.kebabcase'); // tslint:disable-line:no-require-imports
import { get_git_info } from './utils';

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
  import_tslib: boolean;
  use_exact_version: boolean;
  enable_codecov: boolean;
  enable_greenkeeper: boolean;
}

export type Fields = Answers & {
  project_keywords: string[];
  node_versions: string[];
  github_profile: string;
  github_repository: string;
};

export const get_dependencies = (fields: Fields) =>
  fields.import_tslib ? ['tslib'] : [];

export const get_dev_dependencies = (fields: Fields) =>
  [
    '@types/jest',
    'jest',
    'standard-version',
    'ts-jest',
    'tslint',
    'typescript',
  ].concat(
    fields.tslint_config_preset.startsWith('tslint:')
      ? []
      : fields.tslint_config_preset,
  );

export const get_questions = (appname: string) => ({
  project_name: {
    type: 'input',
    message: 'Project Name',
    default: dashify(appname),
  },
  project_description: {
    type: 'input',
    message: 'Project Description',
  },
  project_keywords: {
    type: 'input',
    message: 'Project Keywords',
  },
  user_name: {
    type: 'input',
    message: 'User Name',
    default: get_git_info('user.name'),
  },
  user_email: {
    type: 'input',
    message: 'User Email',
    default: get_git_info('user.email'),
  },
  github_username: {
    type: 'input',
    message: 'GitHub Username',
    default: get_git_info('user.name'),
  },
  tslint_config_preset: {
    type: 'input',
    message: 'TSLint Config Preset',
    default: 'tslint-config-ikatyang',
  },
  node_version: {
    type: 'list',
    message: 'Target Node Version',
    default: '4',
    choices: ['4', '6', '8'],
  },
  source_directory: {
    type: 'input',
    message: 'Source Directory',
    default: 'src',
  },
  generated_directory: {
    type: 'input',
    message: 'Generated Directory',
    default: 'lib',
  },
  import_tslib: {
    type: 'confirm',
    message: 'Import helpers from tslib',
    default: true,
  },
  use_exact_version: {
    type: 'confirm',
    message: 'Use Exact Version',
    default: true,
  },
  enable_codecov: {
    type: 'confirm',
    message: 'Enable Codecov',
    default: true,
  },
  enable_greenkeeper: {
    type: 'confirm',
    message: 'Enable Greenkeeper',
    default: true,
  },
});

export const get_fields = (answers: Answers): Fields => {
  const questions = get_questions(answers.project_name);
  const keywords_text =
    typeof answers.project_keywords === 'string'
      ? answers.project_keywords.trim()
      : '';
  return {
    ...answers,
    project_keywords:
      keywords_text.length === 0
        ? []
        : keywords_text
            .split(/\s+/)
            .map(dashify)
            .sort(),
    node_versions: questions.node_version.choices
      .slice(questions.node_version.choices.indexOf(answers.node_version))
      .concat('stable'),
    github_profile: `https://github.com/${answers.github_username}`,
    github_repository: `https://github.com/${answers.github_username}/${answers.project_name}`,
  };
};
