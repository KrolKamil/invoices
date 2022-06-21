import { writeFile, readFile } from "fs/promises";

export class FileService {
  async save(fileName: string, payload: any) {
    await writeFile(`./out/${fileName}.json`, JSON.stringify(payload, null, 4));
  }

  async get(fileName: string) {
    const file = await readFile(`./in/${fileName}.json`);

    return JSON.parse(file.toString());
  }
}
