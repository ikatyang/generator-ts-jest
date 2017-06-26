import * as dashify from 'dashify';
import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import {get_dependencies, get_questions, Answers, Fields} from './definitions';
import {get_node_versions, get_tsconfig_target} from './utils';

class TSJestGenerator extends Generator {

  public fields: Fields;

  // tslint:disable-next-line:promise-function-async
  public prompting() {
    return this.prompt(get_questions(this.appname)).then((answers: Answers) => {
      const keywords_text = (answers.project_keywords as string).trim();
      this.fields = {
        ...answers,
        project_keywords: (keywords_text.length === 0)
          ? []
          : keywords_text.split(/\s+/).map(dashify),
        tsconfig_target: get_tsconfig_target(answers.node_version),
        node_versions: get_node_versions(answers.node_version),
        github_profile: `https://github.com/${answers.github_username}`,
        github_repository: `https://github.com/${answers.github_username}/${answers.project_name}`,
      };
    });
  }

  public writing() {
    fs.readdirSync(`${__dirname}/templates`)
      .filter(filename => (filename !== 'src'))
      .forEach(filename => {
        this.fs.copyTpl(
          this.templatePath(filename),
          this.destinationPath(filename.replace(/^-/, '.')),
          this.fields,
        );
      });
    this.fs.copyTpl(
      this.templatePath('src/index.ts'),
      this.destinationPath(`${this.fields.source_directory}/index.ts`),
      this.fields,
    );
  }

  public install() {
    const dependencies = get_dependencies(this.fields);
    if (this.fields.use_yarn) {
      this.yarnInstall(dependencies, {
        dev: true,
        ...this.fields.use_exact_version
          ? {exact: true}
          : {},
      });
    } else {
      this.npmInstall(dependencies, {
        'save-dev': true,
        ...this.fields.use_exact_version
          ? {'save-exact': true}
          : {},
      });
    }
  }

}

export = TSJestGenerator;
