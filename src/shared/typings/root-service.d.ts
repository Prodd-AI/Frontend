interface GeneralReturnInt<T = null> {
  data?: T;
  error?: string;
  timstamp: Date;
  status_code: number;
  message: string;
  path: string;
}
