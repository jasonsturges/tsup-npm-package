# tsup NPM Package

Scaffold TypeScript npm packages using this template to bootstrap your next library.

## Getting Started

Begin via any of the following:

- Press the "_Use this template_" button

- Use [GitHub CLI](https://cli.github.com/) to execute:

  ```
  gh repo create <name> --template="https://github.com/jasonsturges/tsup-npm-package"
  ```

- Simply `git clone`, delete the existing .git folder, and initialize a fresh repo:

  ```
  git clone https://github.com/jasonsturges/tsup-npm-package.git
  cd tsup-npm-package
  rm -rf .git
  git init
  git add -A
  git commit -m "Initial commit"
  ```

Remember to use `npm search <term>` to avoid naming conflicts in the NPM Registery for your new package name.

## Usage

The following tasks are available:

- `dev`: Run tsup in watch mode to detect changes - all modules are compiled to the `dist/` folder, as well all types to a d.ts declaration file
- `build`: Run tsup to build a production release distributable

Rollup all your exports to the top-level index.ts for inclusion into the build distributable.

For example, if you have a `utils/` folder that contains an `arrayUtils.ts` file.

/src/utils/arrayUtils.ts:

```ts
export const distinct = <T>(array: T[] = []) => [...new Set(array)];
```

Include that export in the top-level `index.ts` .

/src/index.ts:

```ts
// Main library exports - these are packaged in your distributable
export { distinct } from "./utils/arrayUtils";
```

## Development

To use this library with other app projects before submitting to a registry such as NPM, run the `dev` script and link packages.

Using the `dev` task, tsup detects changes and compiles all modules to the `dist/` folder, as well as rollup of all types to a d.ts declaration file.

To test your library from within an app:

- **From this library**: run `npm link` or `yarn link` command to register the package
- **From your app**: run `npm link "mylib"` or `yarn link "mylib"` command to use the library inside your app during development

Inside your app's `node_modules/` folder, a symlink is created to the library.

## Development Cleanup

Once development completes, `unlink` both your library and test app projects.

- **From your app**: run `npm unlink "mylib"` or `yarn unlink "mylib"` command to remove the library symlink
- **From your library**: run `npm unlink` or `yarn unlink` command to unregister the package

If you mistakenly forget to `unlink`, you can manually clean up artifacts from `yarn` or `npm`.

For `yarn`, the `link` command creates symlinks which can be deleted from your home directory:

```
~/.config/yarn/link
```

For `npm`, the `link` command creates global packages which can be removed by executing:

```bash
sudo npm rm --global "mylib"
```

Confirm your npm global packages with the command:

```bash
npm ls --global --depth 0
```

For your app, simply reinstall dependencies to clear any forgotten linked packages. This will remove any symlinks in the `node_modules/` folder.

## Release Publishing

Update your `package.json` to the next version number and tag a release.

Assure that your package lockfile is also updated by running an install. For npm, this will assure the lockfile has the updated version number. Yarn does not duplicate the version number in the lockfile.

If you are publishing to a private registry such as GitHub packages, update your `package.json` to include `publishConfig` and `repository`:

package.json:

```json
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/@MyOrg"
  }
```

Unless you are using a continuous integration service such as GitHub Actions, assure that your `dist/` folder is cleanly build. Note that `npm publish` will ship anything inside the distributable folder.

For clean builds, you may want to install the `rimraf` package and add a `clean` or `prebuild` script to your `package.json` to remove any artifacts from your `dist/` folder. Or, manually delete the `dist/` folder yourself.

package.json:

```json
  "scripts": {
    "clean": "rimraf dist"
  }
```

Before you submit for the first time, make sure your package name is available by using `npm search`. If npm rejects your package name, update your `package.json` and resubmit.

```bash
npm search <term>
```

Once ready to submit your package to the NPM Registry, execute the following tasks via `npm` (or `yarn`):

```bash
npm run build
```

Assure the proper npm login:

```bash
npm login
```

Submit your package to the registry:

```bash
npm publish --access public
```

## Continuous Integration

For continuous integration with GitHub Actions, create a `.github/workflows/publish.yml`.

For public NPM packages, use the following workflow:

```yml
name: Publish Package to npmjs
on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

For private GitHub packages, use the following workflow:

```yml
name: Publish Package to GitHub Packages
on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
          scope: "@MyOrg"
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm ci
      - run: npm run build
      - run: npm publish
```

This will deploy your build artifact when a release is tagged.

Obtain an "Automation" CI/CD access token to bypass 2FA from [npm](https://www.npmjs.com/) by selecting your profile image in the upper right, and chosing "Access Tokens".

To add secrets to your repository:

- From your repository, select _Settings_
- From the _Security_ section of the sidebar, expand _Secrets and variables_ and select _Actions_
- From the _Secrets_ tab, press _New repository secret_ to add the `NPM_TOKEN` key

To add secrets to your organization:

- From your organization, select _Settings_
- From the _Security_ section of the sidebar, expand _Secrets and variables_ and select _Actions_
- From the _Secrets_ tab, press _New organization secret_ to add the `NPM_TOKEN` key

Assure either a `.npmrc` or `publishConfig` in your `package.json`:

package.json:

```json
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/",
    "scope": "username"
  }
```

For more information, see:

- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Publish to npmjs and GPR with npm](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#publish-to-npmjs-and-gpr-with-npm)
