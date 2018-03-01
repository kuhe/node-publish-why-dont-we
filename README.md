# node-publish-why-dont-we

`npm install @kuhe-org/publish-why-dont-we`

`npx publish-why-dont-we` or run `main.js`.

It will, using the package.json in the process current directory, take the version
as prospective, and where that version's tag does not exist, tag and push it, and where 
that npm version does not exist, publish it to the registry.
