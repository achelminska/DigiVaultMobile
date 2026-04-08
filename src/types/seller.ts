export interface SellerCourse {
  idCourse: number;
  title: string;
  price: number;
  imageUrl?: string;
  categoryName: string;
  salesCount: number;
  averageRating: number;
  ratingsCount: number;
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  idCategory: number;
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  idCategory: number;
}
