import TypedRegistry from './TypedRegistry';

class TestClass {
  private a;
  private b;
  private c;
  constructor(a = 1, b = 1, c = 1) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  sum() {
    return this.a + this.b + this.c;
  }
}
const VALUE = 123;
const OBJ = { a: 1, b: { b1: 11, b2: 12 }, c: [1, 2, 3] };
const FN = (a, b, c) => a + b + c;
const FACTORY = (...args) => new TestClass(...args);

describe('TypedRegistry', () => {
  describe('reference (default)', () => {
    test('value', () => {
      const registry = new TypedRegistry<typeof VALUE>('test');
      registry.register('PRIMITIVE', VALUE);

      const raw = registry.getRaw('PRIMITIVE');
      expect(raw).toBe(VALUE);

      const result = registry.resolve('PRIMITIVE');
      expect(result).toBe(VALUE);
    });

    test('object', () => {
      const registry = new TypedRegistry<typeof OBJ>('test');
      registry.register('OBJECT', OBJ);

      const raw = registry.getRaw('OBJECT');
      expect(raw).toBe(OBJ);

      const result = registry.resolve('OBJECT');
      expect(result).not.toBe(OBJ);
      expect(result).toEqual(OBJ);
    });

    test('function', () => {
      const registry = new TypedRegistry<typeof FN>('test');
      registry.register('FUNCTION', FN);

      const raw = registry.getRaw('FUNCTION');
      expect(raw).toBe(FN);

      const result = registry.resolve('FUNCTION');
      expect(result).toBe(FN);
    });
  });

  describe('instance (default)', () => {
    test('class', () => {
      const registry = new TypedRegistry<TestClass>('test');
      registry.register('CLASS', TestClass);

      const raw = registry.getRaw('CLASS');
      expect(raw).toBe(TestClass);

      const result = registry.resolve('CLASS', { args: [1, 2, 3] });
      expect(result).toBeInstanceOf(TestClass);
      expect(result?.sum()).toBe(6);
    });
  });

  test('instance', () => {
    const registry = new TypedRegistry<TestClass>('test');
    registry.register('CLASS', TestClass, { type: 'instance' });

    const raw = registry.getRaw('CLASS');
    expect(raw).toBe(TestClass);

    const result = registry.resolve('CLASS', { args: [1, 2, 3] });
    expect(result).toBeInstanceOf(TestClass);
    expect(result?.sum()).toBe(6);
  });

  test('reference', () => {
    const registry = new TypedRegistry<TestClass>('test');
    const value = new TestClass(4, 5, 6);
    registry.register('REFERENCE', value, { type: 'reference' });

    const raw = registry.getRaw('REFERENCE');
    expect(raw).toBe(value);

    const result = registry.resolve('REFERENCE');
    expect(result).toBe(value);
    expect(result.sum()).toBe(15);
  });

  test('clone', () => {
    const registry = new TypedRegistry<TestClass>('test');
    const value = new TestClass(4, 5, 6);
    registry.register('CLONE', value, { type: 'clone' });

    const raw = registry.getRaw('CLONE');
    expect(raw).toBe(value);

    const result = registry.resolve('CLONE');
    expect(result).toBeInstanceOf(TestClass);
    expect(result).not.toBe(value);
    expect(result.sum()).toBe(15);
  });

  test('factory', () => {
    const registry = new TypedRegistry<TestClass>('test');
    registry.register('FACTORY', FACTORY, { type: 'factory' });

    const raw = registry.getRaw('FACTORY');
    expect(raw).toBe(FACTORY);

    const result = registry.resolve('FACTORY', { args: [1, 2, 3] });
    expect(result).toBeInstanceOf(TestClass);
    expect(result.sum()).toBe(6);
  });

  test('singleton', () => {
    const registry = new TypedRegistry<TestClass>('test');
    registry.register('SINGLETON', TestClass, { singleton: true });

    const raw = registry.getRaw('SINGLETON');
    expect(raw).toBe(TestClass);

    const result1 = registry.resolve('SINGLETON');
    expect(result1).toBeInstanceOf(TestClass);
    expect(result1?.sum()).toBe(3);
    const result2 = registry.resolve('SINGLETON');
    expect(result2).toBe(result1);
  });

  test('null', () => {
    const registry = new TypedRegistry('test');
    registry.register('NULL', null);

    const raw = registry.getRaw('NULL');
    expect(raw).toBe(null);

    const result = registry.resolve('NULL');
    expect(result).toBe(null);
  });

  test('registerAll', () => {
    const registry = new TypedRegistry('test');
    registry.registerAll([
      { key: 'PRIMITIVE', raw: VALUE, tags: ['a'] },
      { key: 'OBJECT', raw: OBJ, tags: ['b'] },
      { key: 'FUNCTION', raw: FN, tags: ['a'], type: 'factory' },
      { key: 'CLASS', raw: TestClass, tags: ['b'] },
      { key: 'NULL', raw: null, tags: ['a'] },
    ]);

    const raws = registry.getRawByTag('b');
    expect(raws[0]).toBe(OBJ);
    expect(raws[1]).toBe(TestClass);

    const result = registry.resolveByTag('a', { args: [1, 2, 3] });
    expect(result[0]).toBe(VALUE);
    expect(result[1]).toBe(6);
    expect(result[2]).toBe(null);
  });

  test('no entry', () => {
    const registry = new TypedRegistry('test');

    const raw = registry.getRaw('NOENTRY');
    expect(raw).toBeUndefined();

    const result = registry.resolve('NOENTRY');
    expect(result).toBeUndefined();
  });
});
