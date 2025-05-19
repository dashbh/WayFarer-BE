import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Destination, DestinationSchema } from '@wayfarer/common';
import { MongoDatabaseModule } from '@wayfarer/framework';

import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';

@Module({
  imports: [
    MongoDatabaseModule,
    MongooseModule.forFeature([
      {
        name: Destination.name,
        schema: DestinationSchema,
      },
    ]),
  ],
  controllers: [DestinationController],
  providers: [DestinationService],
})
export class DestinationModule {}
