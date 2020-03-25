import React from "react";
import { Route, Switch, Redirect, HashRouter, BrowserRouter as Router} from "react-router-dom";
import routes from "./routes.js";
import Menu from "./components/menu.js";

export default function App() {

    return (
        <>
        <Router>
            <HashRouter>
                <Menu />
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                            <Route
                                exact={true}
                                path={prop.path}
                                component={prop.component}
                                key={key}
                            />
                        );
                    })}
                    <Redirect from="/" to="/tasks"/>
                </Switch>
            </HashRouter>
        </Router>
        </>
    );
}