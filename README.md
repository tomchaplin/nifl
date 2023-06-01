# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _adapters_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different adapter, add it to the `devDependencies` in `package.json` and specify in your `vite.config.js`.

## Notes

You will get errors relating to not being able to resolve the following packages

* aws-sdk
* mock-aws-s3
* nock
* pg-hstore

Just ignore these, the rest of the site should still work

When running in dev mode, you will get source map issues from `html5-qrcode` (see [html5-qrcode/issues/396](https://github.com/mebjas/html5-qrcode/issues/396)).
These should issues should go away once built.

## TODO

- [ ] Write a README
- [ ] Explain the docker container
- [ ] Write types for `Container`
- [ ] Colour schemes (configurable?)
