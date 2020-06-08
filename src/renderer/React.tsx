import React from 'react';
import { render } from 'react-dom';
import { RootScreen } from './screens/RootScreen';
import { Provider } from 'react-redux';
import { createApplicationStore } from './store/Store';
import { IpcEventDispatcher } from './utils';

const store = createApplicationStore();
IpcEventDispatcher.ProxyIpcEventToRedux(store.dispatch);

render(
    <Provider store={store}>
        <RootScreen />
    </Provider>,
    document.getElementById('app')
);