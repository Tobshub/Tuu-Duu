export interface NewFormProps {
  form_type: string,
  required?: {name: boolean, description: boolean},
  nextAction?: () => void,
  backAction?: () => void,
}