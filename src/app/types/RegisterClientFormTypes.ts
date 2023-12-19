import { TypeOf } from 'zod';
import { signUp } from '@/app/utils/register/client/form/inputsValidation';
export type IFormSignUpInputs = TypeOf<typeof signUp>;
