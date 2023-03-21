import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export default class FirebaseLogin extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    currentScreen: 'login', // can be: 'login' or 'register' or 'forgot'
  };

  changeScreen = screenName => () => {
    this.setState({currentScreen: screenName});
  };

  userSuccessfullyLoggedIn = user => {
    this.props.login(user);
  };

  render() {
    let screenToShow;

    switch (this.state.currentScreen) {
      case 'login':
        screenToShow = (
          <Login
            change={this.changeScreen}
            success={this.userSuccessfullyLoggedIn}
          />
        );
        break;
      case 'register':
        screenToShow = <Register change={this.changeScreen} />;
        break;
      case 'forgot':
        screenToShow = <ForgotPassword change={this.changeScreen} />;
        break;
    }
    /**    <Image
          source={require('../../assets/images/bg.png')}
          style={styles.background}
          resizeMode="cenyt"

          />
           */
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>
        {screenToShow}
      </KeyboardAwareScrollView>
    );
  }
}

FirebaseLogin.propTypes = {
  login: PropTypes.func.isRequired,
};

FirebaseLogin.defaultProps = {
  background: '../../assets/bg.png',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#020D00',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
});
