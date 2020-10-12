npm config set '//registry.npmjs.org/:_authToken' "${NPM_AUTH_TOKEN}"
echo "Building package..."
yarn build
echo "Publishing latest version on npm ..."
npm publish
