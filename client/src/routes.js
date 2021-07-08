import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/home';
import Room from './components/room';

const routes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/games/:roomName', name: 'Room', Component: Room },
]

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/games/:roomName" component={Room} />
        </Switch>
    );
}