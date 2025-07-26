export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category?: {
    _id: string;
    name: string;
  };
  publishedAt: string;
}

