export interface FSTreeModel {
  id: string;
  name: string;
  isDirectory: boolean;
  depth: number;
  children: FSTreeModel[];
}
