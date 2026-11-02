const fs = require('fs');

// The tsconfig.aliases.json uses JSONC (JSON with comments) — strip line comments before parsing.
const aliasesRaw = fs.readFileSync('./tsconfig.aliases.json', 'utf-8').replace(/\/\/[^\n]*/g, '');
const {compilerOptions} = JSON.parse(aliasesRaw);

// Convert TypeScript path aliases to Jest moduleNameMapper format.
const moduleNameMapper = Object.fromEntries(
    Object.entries(compilerOptions.paths).map(([key, [value]]) => [
        `^${key.replace('/*', '/(.*)$')}`,
        `<rootDir>/${value.replace('/*', '/$1')}`,
    ]),
);

// @moodlehq/design-system (see GitHub issue #9, parent #1) is ESM-only: its package.json
// `exports["."]` only declares an `import` condition (no `require`/`main`), so ts-jest's
// CommonJS-style require() call for it can't be resolved by Jest's default resolver
// ("Cannot find module '@moodlehq/design-system'"). Map the bare specifier straight to its
// built ESM entry file, bypassing `exports` condition resolution entirely.
moduleNameMapper['^@moodlehq/design-system$'] = '<rootDir>/node_modules/@moodlehq/design-system/dist/index.js';

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    clearMocks: true,
    testMatch: ['**/esm/tests/**/*.test.{ts,tsx}'],
    moduleNameMapper,
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: './tsconfig.jest.json',
        }],
        // The design-system entry file above (and the component files it imports) is plain
        // `import`/`export` syntax, which Jest's CommonJS runtime can't execute directly.
        // Transpile it to CommonJS with ts-jest (reusing the toolchain already set up for our
        // own .ts/.tsx, rather than babel-jest, whose default syntax plugins need a newer
        // @babel/core than the one this repo's legacy build pins); `isolatedModules` does a
        // fast, single-file transpile with no type-checking/project resolution, since this is
        // pre-built vendor code, not our own source. See the matching transformIgnorePatterns
        // override below, which is what lets this transform reach into node_modules for it.
        '^.+\\.js$': ['ts-jest', {
            isolatedModules: true,
            tsconfig: {
                allowJs: true,
                target: 'ES2022',
                module: 'node16',
                moduleResolution: 'node16',
                esModuleInterop: true,
            },
        }],
    },
    // Jest ignores all of node_modules for `transform` by default; carve out an exception
    // for @moodlehq/design-system so the ts-jest `.js` transform above actually runs on it.
    transformIgnorePatterns: ['node_modules/(?!@moodlehq/design-system/)'],
    setupFiles: [
        '<rootDir>/.jest/globalM.ts',
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/.jest/globalSetup.ts',
        '<rootDir>/.jest/mockRedirect.ts',
    ],
    collectCoverageFrom: [
        '**/esm/src/**/*.{ts,tsx}',
        '!**/*.d.ts',
    ],
};
