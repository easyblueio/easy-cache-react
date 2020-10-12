import * as React from 'react';

export type EasyCacheHookType = {
  loading: boolean;
  isUpToDate: boolean;
  error: Error | null;
};

const semverGreaterThan = (
  serverVersion: string,
  clientVersion: string
): boolean => {
  const splitServerVersion = serverVersion.split(/\./g);

  const splitClientVersion = clientVersion.split(/\./g);
  while (splitServerVersion.length || splitClientVersion.length) {
    const currentServerVersionLevel = Number(splitServerVersion.shift());

    const currentClientVersionLevel = Number(splitClientVersion.shift());
    if (currentServerVersionLevel === currentClientVersionLevel) {
      continue;
    }
    return (
      currentServerVersionLevel > currentClientVersionLevel ||
      isNaN(currentClientVersionLevel)
    );
  }
  return false;
};

export type ReleaseResolverType = (payload: Record<string, any>) => string;

const defaultResolver: ReleaseResolverType = ({ version }) => version;

export function useEasyCache(
  packageJsonVersion: string,
  timeout: number = 0,
  onCacheReload: () => void = () => window.location.reload(true),
  metaPath: string = '/meta.json',
  resolver?: ReleaseResolverType
): EasyCacheHookType {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isUpToDate, setIsUpToDate] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    async function checkVersion() {
      if (__DEV__) {
        console.log(`Current browser version is ${packageJsonVersion}.`);
      }

      try {
        const response = await fetch(metaPath);
        if (!response.ok) {
          throw new Error('Error fetching meta file on server data.');
        }

        const jsonData = await response.json();
        const version = (resolver ?? defaultResolver)(jsonData);
        if (__DEV__ && version) {
          console.log(`Current server version is ${version}.`);
        }

        if (!version) {
          throw new Error('No server version defined or found in server data.');
        }

        const shouldForceRefresh = semverGreaterThan(
          version,
          packageJsonVersion
        );
        if (shouldForceRefresh) {
          setIsUpToDate(false);

          setTimeout(onCacheReload, timeout);
        } else {
          setIsUpToDate(true);
        }
        setLoading(false);
      } catch (e) {
        if (__DEV__) {
          console.error(e);
        }
        setError(e);
        setLoading(false);
      }
    }

    if (process.env.NODE_ENV === 'production') {
      checkVersion();
    } else {
      setLoading(false);
      setIsUpToDate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, isUpToDate, error };
}
