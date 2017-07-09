import * as fs from 'fs';
import * as path from 'path';
import * as helpers from 'yeoman-test';
import {Answers} from '../src/definitions';
import MyGenerator = require('../src/index'); // tslint:disable-line:no-require-imports

let dirname: string;
let run_context: helpers.RunContext;

const original_cwd = process.cwd();
const default_answers: Answers = {
  project_name: 'my-awesome-project',
  project_description: 'my awesome description',
  project_keywords: 'my awesome keywords',
  github_username: 'ikatyang',
  user_name: 'Ika',
  user_email: 'ikatyang@gmail.com',
  tslint_config_preset: 'tslint-config-ikatyang',
  node_version: '6',
  source_directory: 'src',
  generated_directory: 'lib',
  use_exact_version: true,
  enable_codecov: true,
  enable_greenkeeper: true,
};

describe('default', () => {

  beforeAll(before_all(default_answers));
  afterAll(after_all());

  test('src/index.ts', () => {
    assert_file_content('src/index.ts');
  });
  test('.editorconfig', () => {
    assert_file_content('.editorconfig');
  });
  test('.gitattributes', () => {
    assert_file_content('.gitattributes');
  });
  test('.gitignore', () => {
    assert_file_content('.gitignore');
  });
  test('.npmignore', () => {
    assert_file_content('.npmignore');
  });
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('CHANGELOG.md', () => {
    assert_file_content('CHANGELOG.md');
  });
  test('jest.json', () => {
    assert_file_content('jest.json');
  });
  test('package.json', () => {
    assert_file_content('package.json');
  });
  test('README.md', () => {
    assert_file_content('README.md');
  });
  test('tsconfig.build.json', () => {
    assert_file_content('tsconfig.build.json');
  });
  test('tsconfig.json', () => {
    assert_file_content('tsconfig.json');
  });
  test('tslint.json', () => {
    assert_file_content('tslint.json');
  });
});

describe('project_keywords = ""', () => {
  beforeAll(before_all({...default_answers, project_keywords: ''}));
  afterAll(after_all());
  test('package.json', () => {
    assert_file_content('package.json');
  });
});
describe('node_version = 4', () => {
  beforeAll(before_all({...default_answers, node_version: '4'}));
  afterAll(after_all());
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('package.json', () => {
    assert_file_content('package.json');
  });
  test('tsconfig.json', () => {
    assert_file_content('tsconfig.json');
  });
});
describe('enable_codecov = false', () => {
  beforeAll(before_all({...default_answers, enable_codecov: false}));
  afterAll(after_all());
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('README.md', () => {
    assert_file_content('README.md');
  });
});
describe('enable_greenkeeper = false', () => {
  beforeAll(before_all({...default_answers, enable_greenkeeper: false}));
  afterAll(after_all());
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('README.md', () => {
    assert_file_content('README.md');
  });
});

function before_all(answers: Answers) {
  return () => {
    run_context = helpers
      .run(MyGenerator)
      .withPrompts(answers);
    return run_context.then(dir => { dirname = dir; });
  };
}

function after_all() {
  return () => {
    // run_context.cleanTestDirectory();
    process.chdir(original_cwd);
  };
}

function assert_file_content(filename: string, is_show = false) {
  const absolute_filename = path.resolve(dirname, filename);
  const file_content = fs.readFileSync(absolute_filename, 'utf8');
  if (is_show) {
    console.log(file_content); // tslint:disable-line:no-console
  } else {
    expect(file_content).toMatchSnapshot();
  }
}
