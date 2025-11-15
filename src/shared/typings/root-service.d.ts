type BaseReturnType = {
  message: string;
  timestamp: string;
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
