export interface ITelexPayload {
  event_name: string;
  status: string;
  username: string;
  message: string;
}

export interface ITelexErrorDetails {
  url: string;
  method: string;
  message: string;
  stack: string;
}

export interface ITelexErrorWorkerData {
  webhookUrl: string;
  details: ITelexErrorDetails;
}

export interface ITelexNotificationWorkerData {
  webhookUrl: string;
  details: ITelexNotificationDetails;
}

export interface ITelexNotificationDetails {
  method: string;
  url: string;
  responseTime: string;
  statusCode: number;
}
