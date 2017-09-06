import { execSync } from 'child_process';

export function get_git_info(field: string): string {
  try {
    return execSync(`git config --get ${field}`, { encoding: 'utf8' }).trim();
  } catch (e) {
    // istanbul ignore next
    return '';
  }
}
