import { TypeOf } from 'zod';
import { signUp } from '@/app/utils/register/client/form/inputsValidation';
export type IFormSignUpInputs = TypeOf<typeof signUp>;


export type IInputType = "text" | "email" | "select" | "radio" | "number" | "checkbox" | "search" | "date" | "tel" | "textarea" | "new-radio" | "new-checkbox"| "new-select";