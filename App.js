import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from './src/screens/LoginScreen';
import {AuthContext} from './src/util/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SplashScreen} from './src/screens/SplashScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {DetailsScreen} from './src/screens/DetailsScreen';

const StackAuth = createStackNavigator();
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#345177',
    accent: '#00AB84',
  },
};
function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn" screenOptions={{headerShown: false}}>
      <StackAuth.Screen name="Login"  options={{
        title: 'Inicio de sesión',
        headerStyle: {
          backgroundColor: '#345177',
        },
        headerTintColor: '#fff',

      }} component={LoginScreen} />
    </StackAuth.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App({navigation}) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('userToken');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        console.log('SignIn Data: ', data);
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <PaperProvider theme={theme} style={{ flex: 1 }}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: true}}>
            {state.isLoading ? (
              <Stack.Screen options={{headerShown: false}} name="Splash" component={SplashScreen} />
            ) : state.userToken == null ? (
              <Stack.Screen
                name="SignIn"
                component={AuthStack}
                options={{
                  title: 'Inicio de sesión',
                  headerStyle: {
                    backgroundColor: '#345177',
                  },
                  headerTintColor: '#fff',

                }}
              />
            ) : (
              <>
                <Stack.Screen name="Home"  options={{ title: 'Lista de incidencias', headerStyle: { backgroundColor: '#345177', }, headerTintColor: '#fff'}}  component={HomeScreen} />
                <Stack.Screen name="Details"  options={{ title: 'Detalles', headerStyle: { backgroundColor: '#345177', }, headerTintColor: '#fff'}}  component={DetailsScreen} />
              </>
              )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}
