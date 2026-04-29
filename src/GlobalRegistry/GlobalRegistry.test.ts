import TypedRegistry from '../TypedRegistry';
import GlobalRegistry from './GlobalRegistry';

const globalRegistry = new GlobalRegistry();

describe('GlobalRegistry', () => {
  test('createRegistry', () => {
    const registry = globalRegistry.createRegistry('test1');
    expect(registry.category).toBe('test1');
  });

  test('registerRegistry', () => {
    const registry = new TypedRegistry('test2');
    globalRegistry.registerRegistry(registry);
    const registeredRegistry = globalRegistry.getRegistry('test2');
    expect(registeredRegistry).toBe(registry);
  });

  test('ensureRegistry', () => {
    const registry = globalRegistry.getRegistry('test3');
    const registeredRegistry = globalRegistry.ensureRegistry('test3');
    expect(registry).toBeUndefined();
    expect(registeredRegistry.category).toBe('test3');
  });

  test('register', () => {
    globalRegistry.ensureRegistry('test');
    globalRegistry.register('test', 'REGISTER', 'register');
    const raw = globalRegistry.getRaw('test', 'REGISTER');
    expect(raw).toBe('register');

    const result = globalRegistry.resolve('test', 'REGISTER');
    expect(result).toBe('register');
  });

  test('registerAll', () => {
    globalRegistry.ensureRegistry('test');
    globalRegistry.registerAll('test', [
      { key: 'REGISTER_ALL1', raw: 'registerAll1' },
      { key: 'REGISTER_ALL2', raw: 'registerAll2' },
      { key: 'REGISTER_ALL3', raw: 'registerAll3' },
    ]);
    const raw = globalRegistry.getRaw('test', 'REGISTER_ALL3');
    expect(raw).toBe('registerAll3');

    const result = globalRegistry.resolve('test', 'REGISTER_ALL3');
    expect(result).toBe('registerAll3');
  });

  test('tags', () => {
    globalRegistry.ensureRegistry('test');
    globalRegistry.registerAll('test', [
      { key: 'TAG1', raw: 'tag1', tags: ['a'] },
      { key: 'TAG2', raw: 'tag2', tags: ['b'] },
      { key: 'TAG3', raw: 'tag3', tags: ['a'] },
    ]);
    const raws = globalRegistry.getRawByTag('test', 'a');
    expect(raws).toEqual(['tag1', 'tag3']);

    const result = globalRegistry.resolveByTag('test', 'a');
    expect(result).toEqual(['tag1', 'tag3']);
  });
});
