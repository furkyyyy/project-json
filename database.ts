import { Collection, MongoClient, ObjectId } from "mongodb";
import { Movie, Studio } from "./interfaces";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

import { User } from "./types";
import bcrypt from "bcrypt";

export const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");

export const moviesCollection: Collection<Movie> = client.db("project").collection<Movie>("movies");
export const studiosCollection: Collection<Studio> = client.db("project").collection<Studio>("studios");

const saltRounds: number = 10;

async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
};

async function seed() {
    try{
        if ((await moviesCollection.countDocuments()) === 0) {
            const resMovies = await fetch("https://raw.githubusercontent.com/furkyyyy/project-jsonFiles/refs/heads/main/movies.json");
            const movies = await resMovies.json() as Movie[];
            await moviesCollection.insertMany(movies);
            console.log("Movies seeded");
          }
        
          if ((await studiosCollection.countDocuments()) === 0) {
            const resStudios = await fetch("https://raw.githubusercontent.com/furkyyyy/project-jsonFiles/refs/heads/main/studios.json");
            const studios = await resStudios.json() as Studio[];
            await studiosCollection.insertMany(studios);
            console.log("Studios seeded");
          }
    } catch (error){
        console.log("Seeding failed: ", error);
    }
};

export async function connect() {
  try {
    await client.connect();
    console.log("Connected to database");
    await seed();
    await createInitialUsers();
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
  }
}

export const usersCollection: Collection<User> = client.db("project").collection<User>("users");

async function createInitialUsers() {
    if (await usersCollection.countDocuments() > 0) {
        return;
    }

    const adminEmail: string | undefined = process.env.ADMIN_EMAIL;
    const adminUsername: string | undefined = process.env.ADMIN_USERNAME;
    const adminPassword: string | undefined = process.env.ADMIN_PASSWORD;
    const userEmail: string | undefined = process.env.USER_EMAIL;
    const userUsername: string | undefined = process.env.USER_USERNAME;
    const userPassword: string | undefined = process.env.USER_PASSWORD;

    if (adminEmail === undefined || adminPassword === undefined || userEmail === undefined || userPassword === undefined) {
        throw new Error("Emails and passwords must be set in environment");
    }
    
    await usersCollection.insertMany([
        {
            email: adminEmail,
            username: adminUsername,
            password: await bcrypt.hash(adminPassword, saltRounds),
            role: "ADMIN"
        },
        {
            email: userEmail,
            username: userUsername,
            password: await bcrypt.hash(userPassword, saltRounds),
            role: "USER"
        }
    ]);
};

export async function login(email: string, password: string): Promise<User> {
    if (!email || !password) {
        throw new Error("Email and password required");
    }

    let user: User | null = await usersCollection.findOne<User>({ email: email });

    if (!user || !user.password) {
        throw new Error("Invalid email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Invalid password");
    }

    return user;
}

export async function getMovies(sort: string, order: string, title: string): Promise<Movie[]> {
    let query: any = {};
  
    if (title) {
      query.title = new RegExp(title, "i");
    }
  
    const sortOrder = order === "desc" ? -1 : 1;
    let sortQuery: any = {};
  
    switch (sort) {
      case "releaseYear":
        sortQuery.releaseYear = sortOrder;
        break;
      case "genre":
        sortQuery.genre = sortOrder;
        break;
      case "studio":
        sortQuery["studio.name"] = sortOrder;
        break;
      case "inTheather":
        sortQuery.inTheather = sortOrder;
        break;
      case "title":
      default:
        sortQuery.title = sortOrder;
        break;
    }
  
    return await moviesCollection
      .find(query)
      .sort(sortQuery)
      .collation({ locale: "en" })
      .toArray();
}

export async function getMovieById(id: string): Promise<Movie | null> {
    return await moviesCollection.findOne({ id: id });
}

export async function getStudios(order: string): Promise<Studio[]> {
    const sortOrder = order === "desc" ? -1 : 1;
    return await studiosCollection
        .find({})
        .sort({ name: sortOrder })
        .collation({ locale: "en" })
        .toArray();
}

export async function getStudioById(id: string): Promise<Studio | null> {
    return await studiosCollection.findOne({ id: id });
}

export async function updateMovie(id: string, movie: Movie) {
    return await moviesCollection.updateOne({ id: id }, { $set: movie });
}