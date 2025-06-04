// src/app/api/utils/parseForm.ts
import { Readable } from "stream";
import formidable, { Fields, Files } from "formidable";

export function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    const readable = Readable.from(req.body as any);

    const fakeReq = Object.assign(readable, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
    });

    form.parse(fakeReq as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
