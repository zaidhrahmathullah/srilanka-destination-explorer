
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DestinationDocument = HydratedDocument<Destination>;

@Schema({ timestamps: true })
export class Destination {
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 3000,
  })
  description!: string;

  @Prop({
    type: Number,
    required: true,
    min: -90,
    max: 90,
  })
  latitude!: number;

  @Prop({
    type: Number,
    required: true,
    min: -180,
    max: 180,
  })
  longitude!: number;

  @Prop({
    type: String,
    default: null,
  })
  imageUrl!: string | null;
}

export const DestinationSchema =
  SchemaFactory.createForClass(Destination);
