<center><img src="https://i.imgur.com/bo6FcQ7.png" alt="Easyblue" /></center>

![Lines](https://img.shields.io/badge/Coverage-85.42%25-yellow.svg)
[![npm](https://img.shields.io/npm/v/easy-cache-react.svg?style=flat-square)](https://www.npmjs.com/package/easy-cache-react)
[![npm](https://img.shields.io/npm/dm/easy-cache-react.svg?style=flat-square&colorB=007ec6)](https://www.npmjs.com/package/easy-cache-react)
[![github release](https://img.shields.io/github/release/easyblueio/easy-cache-react.svg?style=flat-square)](https://github.com/easyblueio/easy-cache-react/releases)
[![github issues](https://img.shields.io/github/issues/easyblueio/easy-cache-react.svg?style=flat-square)](https://github.com/easyblueio/easy-cache-react/issues)
[![github closed issues](https://img.shields.io/github/issues-closed/easyblueio/easy-cache-react.svg?style=flat-square&colorB=44cc11)](https://github.com/easyblueio/easy-cache-react/issues?q=is%3Aissue+is%3Aclosed)

## easy-cache-react

Modern, tested and fully written in typescript.

Written here at [easyblue.io](https://www.easyblue.io/), a french insurtech company. Check out our website to see how we're using this package in production.

 ## Installation
 
 `yarn add easy-cache-react` or `npm install easy-cache-react`

## Basic Usage

## useEasyCache hook

```typescript jsx
import * as React from 'react';
import { useEasyCache } from 'easy-cache-react';

import packageJson from '../package.json';

const App: React.FC = () => {
  const { loading, isUpToDate } = useEasyCache(packageJson.version, 1000);

  if (loading) {
    return <>Your App is loading...</>;  
  }

  if (!isUpToDate) {
    return <>A newer version of your app is available, you will be redirected soon...</>;
  }

  return (
    <div>
      Your awesome App
    </div>
  );
};

export default App;
```

Your App need to expose a `meta.json` file (customisable) containing the current production version.

### Full API

````typescript
export type EasyCacheHookType = {
  loading: boolean;
  isUpToDate: boolean;
  error: Error | null;
};

export function useEasyCache(
  packageJsonVersion: string,
  timeout: number = 0,
  onCacheReload: () => void = () => window.location.reload(true),
  metaPath: string = '/meta.json',
  resolver?: ReleaseResolverType
): EasyCacheHookType;
````
