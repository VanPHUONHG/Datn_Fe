export interface BlogImage {
  url: string;
  caption?: string;
  alt?: string;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  thumbnail: string;
  content: string;
  images?: BlogImage[];
  category: string; 
  author?: string;
  publishedAt?: string;
  views?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
