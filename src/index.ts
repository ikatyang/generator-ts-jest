import * as fs from 'fs';
import Generator = require('yeoman-generator');
import {
  get_dependencies,
  get_dev_dependencies,
  get_fields,
  get_questions,
  Answers,
  Fields,
} from './definitions';

import dedent = require('dedent'); // tslint:disable-line:no-require-imports

const helpers = {
  dedent,
  write_if_present: (write: boolean, content: string) => (write ? content : ''),
};

class TsJestGenerator extends Generator {
  public fields: Fields;

  // tslint:disable-next-line:promise-function-async
  public prompting() {
    const questions = get_questions(this.appname);
    return this.prompt(
      Object.keys(questions).reduce(
        (current, name: keyof typeof questions) => [
          ...current,
          { name, ...questions[name] },
        ],
        [],
      ),
    ).then((answers: Answers) => {
      this.fields = get_fields(answers);
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
          this.destinationPath(filename.replace(/^-/, '')),
          template_options,
        );
      });
    this.fs.copyTpl(
      this.templatePath(`${template_dirname}/src/index.ts`),
      this.destinationPath(`${this.fields.source_directory}/index.ts`),
      template_options,
    );
  }

  public async install() {
    const dependencies = get_dependencies(this.fields);
    const dev_dependencies = get_dev_dependencies(this.fields);

    // istanbul ignore next
    await (this as any).yarnInstall(dev_dependencies, {
      dev: true,
      'ignore-scripts': true,
      ...this.fields.use_exact_version ? { exact: true } : {},
    });

    // istanbul ignore next
    await (this as any).yarnInstall(dependencies);
  }
}

export = TsJestGenerator;
