export interface Review {
  idReview: number;
  idUser?: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AddReviewRequest {
  idUser: number;
  idCourse: number;
  rating: number;
  comment: string;
}
