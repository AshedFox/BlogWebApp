import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {privateRoutes, publicRoutes, routes} from "../../constants/routes";
import {observer} from "mobx-react";
import NotFound from "../NotFound/NotFound";
import AuthVerifier from "../AuthVerifier/AuthVerifier";
import {useAccountStore} from "../../store/AccountStore";

const AppRouter = observer (() => {
    const {account} = useAccountStore();
    
    return (
        <>
            <Switch>
                {publicRoutes.map(({path, component}) =>
                    <Route key={path} path={path} component={component} exact/>
                )}
                {account && privateRoutes.map(({path, component}) => 
                    <Route key={path} path={path} component={component} exact/>)
                }
                <Redirect from={routes.main} to={routes.posts}/>
                <Route component={NotFound}/>
            </Switch>
            <AuthVerifier/>
        </>
    );
});

export default AppRouter;
