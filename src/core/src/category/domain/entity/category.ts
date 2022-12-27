import UniqueEntityId from '../../../shared/domain/value-objects/unique-entity-id.vo';
import Entity from '../../../shared/domain/entity/entity';
import CategoryValidatorFactory from './validators/category.validator';
import { EntityValidationError } from '../../../shared/domain/errors/validation-error';

export type CategoryProperties = {
  name: string,
  description?: string,
  is_active?: boolean,
  created_at?: Date,
}

type CategoryUpdateProperties = {
  name?: string,
  description?: string,
}

export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id)
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.created_at = this.props.created_at;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value ?? null;
  }

  get description() {
    return this.props.description
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active() {
    return this.props.is_active
  }

  private set is_active (value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at() {
    return this.props.created_at
  }

  private set created_at (value: Date) {
    this.props.created_at = value ?? new Date();
  }

  update(props: CategoryUpdateProperties) {
    Category.validate({ name: props.name ?? this.name, description: props.description ?? this.description });
    this.name = props.name ?? this.name;
    this.description = props.description ?? this.description;
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }
}