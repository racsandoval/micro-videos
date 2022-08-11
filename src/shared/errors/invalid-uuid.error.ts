export default class InvaludUuidError extends Error {
  constructor(message?: string) {
    super(message ?? 'ID must be a valid uuid');
    this.name = 'InvalidUuidError';
  }
}