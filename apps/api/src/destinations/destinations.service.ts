import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import {
  Destination,
  DestinationDocument,
} from './schemas/destination.schema.js';

import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectModel(Destination.name)
    private readonly destinationModel: Model<DestinationDocument>,
  ) {}

  async findAll(): Promise<Destination[]> {
    return this.destinationModel.find().exec();
  }

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const destination = new this.destinationModel(createDestinationDto);

    return destination.save();
  }

  async findOne(id: string): Promise<Destination> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid destination ID');
    }

    const destination = await this.destinationModel
        .findById(id)
        .exec();

    if (!destination) {
        throw new NotFoundException('Destination not found');
    }

    return destination;
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid destination ID');
    }

    if (Object.keys(updateDestinationDto).length === 0) {
        throw new BadRequestException(
            'At least one field must be provided for updating',
        );
    }

    const destination = await this.destinationModel
        .findByIdAndUpdate(
            id,
            { $set: updateDestinationDto },
            {
                new: true,
                runValidators: true,
            },
        )
        .exec();

    if (!destination) {
        throw new NotFoundException('Destination not found');
    }

    return destination;
  }

  async remove(id: string): Promise<Destination> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid destination ID');
    }

    const destination = await this.destinationModel
        .findByIdAndDelete(id)
        .exec();

    if (!destination) {
        throw new NotFoundException('Destination not found');
    }

    return destination;
  }
}