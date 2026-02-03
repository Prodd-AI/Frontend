type BaseReturnType = {
  message: string;
  timestamp: string;
  meta?: { total: number; limit: number; page: number; total_pages: number };
};

type GeneralReturnInt<T> = {
  data: T;
  success: boolean;
} & BaseReturnType;

type GeneralErrorInt = {
  status_code: number;
  error: string;
  path: string;
} & BaseReturnType;
