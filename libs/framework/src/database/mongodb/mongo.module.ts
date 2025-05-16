import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const username = config.get<string>('MONGO_USERNAME');
        const password = config.get<string>('MONGO_PASSWORD');
        const clusterId = config.get<string>('MONGO_CLUSTER_ID');
        const dbName = config.get<string>('MONGO_DB_NAME');

        const uri = `mongodb+srv://${username}:${encodeURIComponent(password)}@${clusterId}/${dbName}?retryWrites=true&w=majority`;

        return {
          uri,
          dbName,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDatabaseModule {}
