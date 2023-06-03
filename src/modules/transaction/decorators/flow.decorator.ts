import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function isInflowOrOutflowNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInflowOrOutflowNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const inflow = args.object['inflow'];
          const outflow = args.object['outflow'];

          if (
            (inflow === null && outflow === null) ||
            (inflow !== null && outflow !== null)
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `Either '${args.property}' must be null, and the other must have a value.`;
        },
      },
    });
  };
}
