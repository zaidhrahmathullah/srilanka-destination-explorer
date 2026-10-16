import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto.js';

export class UpdateDestinationDto extends PartialType(
  CreateDestinationDto,
  { skipNullProperties: false },
) {}