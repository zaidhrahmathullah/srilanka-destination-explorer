
export type Destination = {
  _id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};
