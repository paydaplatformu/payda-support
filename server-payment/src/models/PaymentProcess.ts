export interface PaymentProcess {
  date: Date;
  result: {
    [t: string]: any;
  };
  isSuccess: boolean;
}
