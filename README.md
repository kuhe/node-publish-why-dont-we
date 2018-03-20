# node-publish-why-dont-we

`npm install @kuhe-org/publish-why-dont-we`

`npx publish-why-dont-we` or run `main.js`.

The script will do the following:

#### 1

Find a prospective version. If the flag `--use-latest-local-tag` is used, then the 
latest local tag will be taken as the prospective version (unless the package.json version is higher) 

In all other cases, the package.json version will be used as the prospective version.

#### 2

Using this prospective version, the program will push a tag for this version only if it does
not already exist on the remote.

It will also `npm publish` this version if and only if it does not already exist. 

Existence of either a tag or npm version equal to the prospective version is not treated as a failure and
instead ignored.

##### Notes

The suggested and designed use-case is running this command after automation has 
verified and merged a PR that may or may not bump the package.json version of a module.
 