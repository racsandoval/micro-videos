import { validateSync } from 'class-validator';
import ValidatorFieldsInterface, { FieldsErros } from './validator-fields-interface';


export default abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErros;
  validateData: PropsValidated;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      errors.forEach((error) => {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints ?? {});
      });
    } else {
      this.validateData = data;
    }
    return !errors.length;
  }

}