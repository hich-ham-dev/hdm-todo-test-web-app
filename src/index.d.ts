export interface Task {
  category:{
    id: number,
    name: string,
  },
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string,
}

export interface Category {
  id: number,
  name: string,
}
