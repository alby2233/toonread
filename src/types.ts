export type ComicType = 'manhwa' | 'manga';

export interface Comic {
  id: string;
  title: string;
  author: string;
  type: ComicType;
  coverUrl: string;
  synopsis: string;
  genres: string[];
  status: 'Ongoing' | 'Completed';
  rating: number;
}

export interface Chapter {
  id: string;
  comicId: string;
  number: number;
  title: string;
  date: string;
  pages: string[]; // URLs of images
}
