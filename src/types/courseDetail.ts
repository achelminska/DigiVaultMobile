export interface CourseDetail {
  idCourse: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  authorName: string;
  categoryName: string;
  salesCount: number;
  averageRating: number;
  ratingsCount: number;
  createdAt: string;
}
