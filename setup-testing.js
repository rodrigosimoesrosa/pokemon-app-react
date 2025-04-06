import 'react-native';
import "reflect-metadata";
import '@testing-library/jest-native/extend-expect';
import "@testing-library/jest-native/legacy-extend-expect";

import "reflect-metadata";

jest.mock("expo", () => ({
  registerRootComponent: jest.fn(),
}));

jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

/*jest.mock('react-native/Libraries/vendor/emitter/EventEmitter', () => {
  return {
    default: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      emit: jest.fn()
    }
  };
});*/

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

// Mock para NativeAnimatedHelper
//jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock para React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: {} })
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(({ children }) => children),
    Screen: jest.fn(),
  })),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));


jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    GestureHandlerRootView: View,
    createNativeWrapper: jest.fn(),
    Directions: {},
  };
});