import React from 'react';
import {StyleSheet, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import LottieAnimation from 'lottie-react-native';

export default class AnimatedLoader extends React.PureComponent {
  static defaultProps = {
    visible: false,
    source: require('./animation.json'),
    animationStyle: ViewPropTypes.style,
    speed: 1,
    loop: true,
  };

  static propTypes = {
    visible: PropTypes.bool,
    source: PropTypes.object,
    animationStyle: ViewPropTypes.style,
    speed: PropTypes.number,
    loop: PropTypes.bool,
  };

  animation = React.createRef();

  componentDidMount() {
    if (this.animation.current) {
      this.animation.current.play();
    }
  }

  componentDidUpdate(prevProps) {
    const {visible} = this.props;
    if (visible !== prevProps.visible) {
      if (this.animation.current) {
        this.animation.current.play();
      }
    }
  }

  _renderLottie = () => {
    const {source, animationStyle, speed, loop} = this.props;
    return (
      <LottieAnimation
        ref={this.animation}
        source={source}
        loop={loop}
        speed={speed}
        style={[styles.animationStyle, animationStyle]}
      />
    );
  };

  render() {
    const {visible, animationType, bg} = this.props;
    let backgroundColor = bg;

    let display = 'none';
    if (visible) {
      display = 'flex';
    }
    return (
      <View
        style={[
          {display: display, backgroundColor: backgroundColor},
          styles.container,
        ]}>
        <View>{this._renderLottie()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationStyle: {
    width: '100%',
    height: 100,
  },
});
