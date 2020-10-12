import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import packageJson from './package.json';
import { useEasyCache } from '../.';

const BooleanToText: React.FC<{ value: boolean }> = ({value}) => <>{value ? 'true' : 'false'}</>;

const App = () => {
    const {loading, isUpToDate, error} = useEasyCache(packageJson.version);

    return (
        <div>
            <p>Loading: <BooleanToText value={loading}/></p>
            <p>IsUpToDate: <BooleanToText value={isUpToDate}/></p>
            <p>Error: {error && error.message}</p>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
