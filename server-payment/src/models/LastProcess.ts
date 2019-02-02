export interface LastProcess {
  date: Date;
  result: {
    [t: string]: any;
  };
  isSuccess: boolean;
}
