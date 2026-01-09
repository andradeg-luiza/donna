import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AssistantAuthMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const key = req.headers['x-assistant-key'];

    if (!key || key !== process.env.ASSISTANT_KEY) {
      throw new ForbiddenException('Invalid assistant key');
    }

    next();
  }
}
