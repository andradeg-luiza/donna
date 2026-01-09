import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AssistantAuthMiddleware } from './common/middleware/assistant-auth.middleware';

@Module({
  imports: [UsersModule, TasksModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AssistantAuthMiddleware).forRoutes('*');
  }
}
