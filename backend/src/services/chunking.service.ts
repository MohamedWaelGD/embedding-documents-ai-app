import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { config } from '../config';

export interface TextChunk {
  content: string;
  index: number;
}

const separators = ['\n\n', '\n', '. ', '، ', '؛ ', ' ', ''];

export async function chunkText(text: string): Promise<TextChunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.chunking.chunkSize,
    chunkOverlap: config.chunking.chunkOverlap,
    separators,
  });

  const raw = await splitter.splitText(text);
  return raw
    .map((content, index) => ({ content, index }))
    .filter((chunk) => chunk.content.trim().length > 0);
}
