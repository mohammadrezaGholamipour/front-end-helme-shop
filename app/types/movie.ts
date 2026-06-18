export interface Movie {
  id: number
  title: string
  description: string
  year: number
}

export interface CreateMovieDto {
  title: string
  description: string
  year: number
}