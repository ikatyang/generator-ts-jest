import * as fs from 'fs';
import * as path from 'path';
import * as helpers from 'yeoman-test';
import {
  get_dependencies,
  get_dev_dependencies,
  get_fields,
  Answers,
  Fields,
} from '../src/definitions';
import MyGenerator = require('../src/index');

jest
  .spyOn(MyGenerator.prototype.user.github, 'username')
  .mockImplementation(async () => '<github-username>');

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
  prettier_config_preset: 'prettier-config-ikatyang',
  node_version: '6',
  source_directory: 'src',
  generated_directory: 'lib',
  import_tslib: true,
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
  test('tests/test.ts', () => {
    assert_file_content('tests/test.ts');
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
  test('jest.config.js', () => {
    assert_file_content('jest.config.js');
  });
  test('prettier.config.js', () => {
    assert_file_content('prettier.config.js');
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
  test('dependencies', () => {
    expect(
      get_multi_dependencies({ ...get_fields(default_answers) }),
    ).toMatchSnapshot();
  });
});

describe('project_keywords = ""', () => {
  beforeAll(before_all({ ...default_answers, project_keywords: '' }));
  afterAll(after_all());
  test('package.json', () => {
    assert_file_content('package.json');
  });
});
describe('node_version = 4', () => {
  beforeAll(before_all({ ...default_answers, node_version: '4' }));
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
  beforeAll(before_all({ ...default_answers, enable_codecov: false }));
  afterAll(after_all());
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('README.md', () => {
    assert_file_content('README.md');
  });
});
describe('enable_greenkeeper = false', () => {
  beforeAll(before_all({ ...default_answers, enable_greenkeeper: false }));
  afterAll(after_all());
  test('.travis.yml', () => {
    assert_file_content('.travis.yml');
  });
  test('README.md', () => {
    assert_file_content('README.md');
  });
});
describe('import_tslib = false', () => {
  test('dependencies', () => {
    expect(
      get_multi_dependencies({
        ...get_fields(default_answers),
        import_tslib: false,
      }),
    ).toMatchSnapshot();
  });
});
describe('tslint_config_preset with prefix `tslint:`', () => {
  test('dependencies', () => {
    expect(
      get_multi_dependencies({
        ...get_fields(default_answers),
        tslint_config_preset: 'tslint:all',
      }),
    ).toMatchSnapshot();
  });
});
describe('prettier_config_preset = empty string', () => {
  test('dependencies', () => {
    expect(
      get_multi_dependencies({
        ...get_fields(default_answers),
        prettier_config_preset: '',
      }),
    ).toMatchSnapshot();
  });
});

function before_all(answers: Answers) {
  return async () => {
    run_context = helpers.run(MyGenerator).withPrompts(answers);
    return run_context.then(dir => {
      dirname = dir;
    });
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

function get_multi_dependencies(fields: Fields) {
  return {
    dependencies: get_dependencies(fields),
    dev_dependencies: get_dev_dependencies(fields),
  };
}
