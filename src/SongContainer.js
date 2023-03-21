import React, {Component} from 'react';
import {connect} from 'react-redux';
import Player from './Player/Player';
import {setLength, seekProgress} from './redux/actions';
class SongContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {...props} = this.props;
    return <Player {...props} />;
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setLength: date => {
      dispatch(setLength(date));
    },
    seekProgress: time => {
      dispatch(seekProgress(time));
    },
  };
};

export default connect(null, mapDispatchToProps)(SongContainer);
