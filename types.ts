import { ObjectId } from "mongodb";

export interface Studio {
  _id?: ObjectId;
  id: string;
  name: string;
  logoUrl: string;
}

export interface Movie {
  _id?: ObjectId;
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  imageUrl: string;
  inTheather: boolean;
  studio: Studio;
}

export interface User {
  _id?: ObjectId;
  email?: string;
  username?: string;
  password?: string;
  role: "ADMIN" | "USER";
}