import * as yup from 'yup';
import { ObjectSchema } from 'yup';
export async function validateYup(body: any, schema: yup.AnySchema) {
  const isValid = await schema.isValid(body);
  if (!isValid) {
    await schema.validate(body);
  }
}