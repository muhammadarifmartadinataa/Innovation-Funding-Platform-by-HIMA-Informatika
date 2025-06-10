// src/utils/webReadableToNodeReadable.ts
import { Readable } from "stream";

export async function webReadableToNodeReadable(webStream: ReadableStream<Uint8Array>): Promise<Readable> {
  const reader = webStream.getReader();

  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
}
