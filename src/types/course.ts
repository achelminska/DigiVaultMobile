export interface Course {
  idCourse: number;
  title: string;
  authorName: string;
  averageRating: number;
  ratingsCount: number;
  price: number;
  imageUrl?: string;
}

export interface Category {
  idCategory: number;
  name: string;
}
