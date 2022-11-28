export interface NotificationArgs {
  content?: NotificationContent,
  action?: NotificationAction
}


interface NotificationContent {
  title?: string,
  message?: string 
}

interface NotificationAction {
  name: string,
  target: string,
  execute: (...args: any) => void, 
}