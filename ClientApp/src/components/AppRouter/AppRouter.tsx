import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {privateRoutes, publicRoutes, routes} from "../../constants/routes";
import {observer} from "mobx-react";
import {useAccountStore} from "../../store/AccountStore";

const AppRouter = observer (() => {
    const {account} = useAccountStore();

    return (
        account && account.tokenValidTo.toString() > new Date().toISOString() ?
        <Switch>
            {publicRoutes.map(({path, component}) =>
                <Route key={path} path={path} component={component} exact/>
            )}
            <Redirect to={routes.main}/>
        </Switch> :
        <Switch>
            {privateRoutes.map(({path, component}) =>
                <Route key={path} path={path} component={component} exact/>
            )}
            <Redirect to={routes.login}/>
        </Switch>
    );
});

export default AppRouter;
