import { Files } from "./files";
import { Folder } from "./folder";

export interface Directory {
  adress: string[],
  folders: Folder[],
  files: Files[],
  id: string
}
