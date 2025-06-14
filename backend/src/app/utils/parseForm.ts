// utils/parseForm.ts
import { NextRequest } from "next/server";
import formidable, { Fields, Files } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

// Konversi Web ReadableStream dari NextRequest menjadi Node Readable Stream
async function convertNextRequestToNodeRequest(req: NextRequest): Promise<IncomingMessage> {
  const stream = req.body;
  const reader = stream?.getReader();
  const nodeStream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.push(value);
      }
      this.push(null);
    },
  });

  const incomingMessage = nodeStream as unknown as IncomingMessage;
  Object.assign(incomingMessage, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.nextUrl.pathname,
  });

  return incomingMessage;
}

// Fungsi utama untuk parsing form-data
export async function parseForm(
  req: NextRequest
): Promise<{ fields: Fields; files: Files }> {
  const nodeReq = await convertNextRequestToNodeRequest(req);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir: uploadDir,
  });

  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
