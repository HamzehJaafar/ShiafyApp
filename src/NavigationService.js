import * as React from 'react';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(name, params) {
  if (_navigator && name) {
    _navigator.navigate(name, params);
  }
}

// Add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
};
