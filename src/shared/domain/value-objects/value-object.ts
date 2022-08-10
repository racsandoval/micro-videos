export default abstract class ValueObject<Value = any> {
  protected _value: Value;

  constructor(value: Value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  toString = () => {
    if (typeof this.value !== 'object' || this.value === null) {
      try {
        return this.value.toString();
      } catch (error) {
        return this.value + "";
      }
    }

    const valueStr = this.value.toString();
    return valueStr === '[Object object]'
      ? JSON.stringify(this.value)
      : valueStr;
  }
}