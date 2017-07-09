import {execSync} from 'child_process';

export function get_tsconfig_target(node_version: string) {
  switch (node_version) {
    case '4':
      return 'es5';
    case '6':
    case '8':
      return 'es6';
    // istanbul ignore next
    default:
      throw new Error(`Invalid node_version '${node_version}'`);
  }
}

export function get_node_versions(node_version: string) {
  const targets: string[] = [];
  // tslint:disable:no-switch-case-fall-through
  switch (node_version) {
    case '4':
      targets.push('4');
    case '6':
      targets.push('6');
    case '8':
      targets.push('8');
      break;
    // istanbul ignore next
    default:
      throw new Error(`Invalid node_version '${node_version}'`);
  }
  // tslint:enable:no-switch-case-fall-through
  return targets;
}

export function get_git_info(field: string): string {
  try {
    return execSync(`git config --get ${field}`, {encoding: 'utf8'}).trim();
  } catch (e) {
    // istanbul ignore next
    return '';
  }
}
