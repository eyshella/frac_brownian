import React from 'react';
import { render } from 'react-dom';
import { RootScreen } from './screens/RootScreen';
import { Provider } from 'react-redux';
import { createApplicationStore } from './store/Store';

render(
    <Provider store={createApplicationStore()}>
        <RootScreen />
    </Provider>,
    document.getElementById('app')
);