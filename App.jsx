import * as React from 'react';
import {Provider, useDispatch} from 'react-redux';
import store from './src/redux/store';
import RootNavigation from './src/Navigation/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setToken} from './src/redux/ProfileSlice';
import CheckInternet from './src/utils/CheckInternet';

function App() {
  const [authKey, setAuthKey] = React.useState(null);
  const [isconnected, setIsconnected] = React.useState(false);

  console.log(authKey, 'authKeybbb');
  React.useEffect(() => {
    const getAuthKey = async () => {
      try {
        const key = await AsyncStorage.getItem('AuthKey');
        if (key) {
          store.dispatch(setToken(true));
          setAuthKey(key);
        }
        console.log('AuthKey from storage:', key);
      } catch (error) {
        console.log('Error retrieving AuthKey from storage', error);
      }
    };
    getAuthKey();
  }, []);

  return (
    <Provider store={store}>
      {isconnected == true ? (
        <>
          <RootNavigation token={authKey} />
        </>
      ) : null}
      <CheckInternet
        isconnected={isconnected}
        setIsconnected={setIsconnected}
      />
    </Provider>
  );
}

export default App;
