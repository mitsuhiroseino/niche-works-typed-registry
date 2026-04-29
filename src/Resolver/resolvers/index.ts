import resolveAsClone from './resolveAsClone';
import resolveAsFactory from './resolveAsFactory';
import resolveAsInstance from './resolveAsInstance';
import resolveAsReference from './resolveAsReference';

export default [
  ['instance', resolveAsInstance],
  ['factory', resolveAsFactory],
  ['reference', resolveAsReference],
  ['clone', resolveAsClone],
] as const;
