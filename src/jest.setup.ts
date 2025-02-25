import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

import structuredClone from '@ungap/structured-clone';

window.structuredClone = structuredClone;
