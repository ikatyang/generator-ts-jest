import { add } from '../<%= source_directory %>/index';

test('1 + 2 = 3', () => {
  expect(add(1, 2)).toBe(3);
});
