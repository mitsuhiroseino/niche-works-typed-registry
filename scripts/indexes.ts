import indexes from '@fringeworks/dev/indexes';
import {
  CONSTANTS,
  PRIVATE,
  TEST_FILE,
} from '@fringeworks/dev/indexes/constants';

indexes({
  exclude: [
    CONSTANTS,
    PRIVATE,
    TEST_FILE,
    {
      valueType: 'dirname',
      conditions: 'Resolver',
    },
    {
      valueType: 'dirname',
      conditions: 'resolvers',
    },
    {
      valueType: 'name',
      conditions: 'Resolver',
    },
    {
      valueType: 'dirname',
      conditions: 'Store',
    },
    {
      valueType: 'name',
      conditions: 'Store',
    },
  ],
});
