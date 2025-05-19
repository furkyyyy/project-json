export interface Studio {
    id: string;
    name: string;
    logoUrl: string;
    foundedYear: number;
    founder: string;
    headquarters: string;
}

export interface Movie {
    id: string;
    title: string;
    description: string;
    genre: string;
    director: string;
    releaseYear: number;
    inTheather: boolean;
    releaseDate: string;
    imageUrl: string;
    rating: string;
    actors: string[];
    contentRating: string;
    studio: Studio;
}