export type { Priority, TaskStatus, MemoryCategory } from "@prisma/client";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface TagWithCount {
  id: string;
  name: string;
  color: string;
  _count?: number;
}
