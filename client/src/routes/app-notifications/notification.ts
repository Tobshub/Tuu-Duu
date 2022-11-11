export interface NotificationArgs {
  content?: NotificationContent,
  action?: NotificationFunction
}


interface NotificationContent {
  title?: string,
  message?: string 
}

interface NotificationFunction {
  name: string,
  execute: (...args: any) => void, 
}