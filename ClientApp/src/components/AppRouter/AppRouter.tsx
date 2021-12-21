import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {noAuthRoutes, privateRoutes, publicRoutes, routes} from "../../constants/routes";
import {observer} from "mobx-react";
import {useAccountStore} from "../../store/AccountStore";
import NotFound from "../NotFound/NotFound";
import AuthVerifier from "../AuthVerifier/AuthVerifier";

const AppRouter = observer (() => {
    const {account} = useAccountStore();
    
    return (
        <>
            <Switch>
                {publicRoutes.map(({path, component}) =>
                    <Route key={path} path={path} component={component} exact/>
                )}
                {
                    account !== undefined ?
                        privateRoutes.map(({path, component}) =>
                            <Route key={path} path={path} component={component} exact/>) :
                        noAuthRoutes.map(({path, component}) =>
                            <Route key={path} path={path} component={component} exact/>)
                }
                {
                    account !== undefined ?
                        noAuthRoutes.map(({path}) => <Redirect key={path} from={path} to={routes.main}/>) :
                        privateRoutes.map(({path}) => <Redirect key={path} from={path} to={routes.main}/>)
                }
                <Route component={NotFound}/>
            </Switch>
            <AuthVerifier/>
        </>
    );
});

export default AppRouter;
