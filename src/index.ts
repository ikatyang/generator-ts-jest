import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import {
  get_dependencies,
  get_questions,
  Answers,
  Fields,
} from './definitions';
import { get_node_versions, get_tsconfig_target } from './utils';

import dedent = require('dedent'); // tslint:disable-line:no-require-imports
import dashify = require('lodash.kebabcase'); // tslint:disable-line:no-require-imports

const helpers = {
  dedent,
  write_if_present: (write: boolean, content: string) => (write ? content : ''),
};

class TsJestGenerator extends Generator {
  public fields: Fields;

  // tslint:disable-next-line:promise-function-async
  public prompting() {
    return this.prompt(get_questions(this.appname)).then((answers: Answers) => {
      const keywords_text =
        typeof answers.project_keywords === 'string'
          ? answers.project_keywords.trim()
          : '';
      this.fields = {
        ...answers,
        project_keywords:
          keywords_text.length === 0
            ? []
            : keywords_text.split(/\s+/).map(dashify).sort(),
        tsconfig_target: get_tsconfig_target(answers.node_version),
        node_versions: get_node_versions(answers.node_version),
        github_profile: `https://github.com/${answers.github_username}`,
        github_repository: `https://github.com/${answers.github_username}/${answers.project_name}`,
      };
    });
  }

  public writing() {
    const template_dirname = `${__dirname}/templates`;
    const template_options = {
      ...helpers,
      ...this.fields,
    };
    fs
      .readdirSync(template_dirname)
      .filter(filename => filename !== 'src')
      .forEach(filename => {
        this.fs.copyTpl(
          this.templatePath(`${template_dirname}/${filename}`),
          this.destinationPath(filename.replace(/^-/, '.')),
          template_options,
        );
      });
    this.fs.copyTpl(
      this.templatePath(`${template_dirname}/src/index.ts`),
      this.destinationPath(`${this.fields.source_directory}/index.ts`),
      template_options,
    );
  }

  public install() {
    const dependencies = get_dependencies(this.fields);

    // istanbul ignore next
    this.yarnInstall(dependencies, {
      dev: true,
      ...this.fields.use_exact_version ? { exact: true } : {},
    });
  }
}

export = TsJestGenerator;
