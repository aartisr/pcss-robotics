import type { IncomingMessage, ServerResponse } from 'node:http';
import { editorApi } from '../server/editorApi';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return editorApi(req, res);
}
