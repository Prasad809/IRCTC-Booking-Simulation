import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../libs/Loader"

const pagesContext = require.context("../Pages",true,/\.js$/);

const componentCache = {};

const getComponent1 = (componentPath) => {
  if (!componentCache[componentPath]) {
    componentCache[componentPath] = React.lazy(() =>
      Promise.resolve({
        default: pagesContext(`./${componentPath}.js`).default,
      })
    );
  }

  return componentCache[componentPath];
};

const getComponent = (componentPath) => {
  if (!componentCache[componentPath]) {
    componentCache[componentPath] = React.lazy(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ default: pagesContext(`./${componentPath}.js`).default });
        }, 2000);
      });
    });
  }
  return componentCache[componentPath];
};

function Maincontainer({ routers, setNxt }) {
  return (
    <Suspense fallback={<Loader text={"loading....!"} fullPage={true} size="lg"/>}>
      <Routes>
        {routers.headComponents.map((route) => {
          const DynamicComponent = getComponent(
            route.component
          );

          return (
            <Route
              key={route.id}
              path={route.path}
              element={
                <DynamicComponent setNxt={setNxt} />
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}

export default Maincontainer;