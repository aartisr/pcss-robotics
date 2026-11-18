import type { IncomingMessage, ServerResponse } from 'node:http';
import { oauthApi } from '../server/oauth.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return oauthApi(req, res);
}
