import * as React from 'react';
import {  View, Text,Image,Alert  } from 'react-native';
import {AuthContext} from '../util/utils';
import SafeAreaView from 'react-native/Libraries/Components/SafeAreaView/SafeAreaView';
import { Button, TextInput } from 'react-native-paper';
import instance from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function LoginScreen({navigation}) {
    //const [email, setEmail] = React.useState('tecnico@gmail.com');
    const [email, setEmail] = React.useState('cliente@gmail.com');
    //const [email, setEmail] = React.useState('miguel@gmail.com');

    const [password, setPassword] = React.useState('123');

  const {signIn} = React.useContext(AuthContext);

  const forgot = () =>{
      Alert.alert( 'Olvide mi contraseña', 'Contacte con el administrador para recuperar la contraseña',[{
          text: 'Ok',
      }]);
  };

  const onSubmit = () =>{
    console.log({email, password});
    instance.post('auth/login', {email,password})
      .then(async res => {
        console.log(res.data.data);
        if (!res.data.status){
            if (res.data.data.user.role[0].authority !== 'administrador'){
                await AsyncStorage.setItem('token', res.data.data.token);
                await AsyncStorage.setItem('role', JSON.stringify(res.data.data.user.role));
                await AsyncStorage.setItem('role-name', res.data.data.user.role[0].authority);
                signIn(res.data.data.token);
            }
            else {
                Alert.alert( 'Acceso denegado', 'Administrador inicie sesión en la web',[{
                    text: 'Ok',
                }]);
            }
        }
      })
      .catch(err=>{
        Alert.alert( 'Acceso denegado', 'Correo electronico y/o contraseña incorrectos',[{
          text: 'Ok',
        }]);
        console.log(err);
      });
  };
  return (
    <SafeAreaView style={{marginTop:25}}>
      <View style={{ alignItems: 'center'}} >

        <Image source={require('../assets/utez3.png')}/>

      </View>
      <View>
        <Text style={{fontSize:20, textAlign:'center', color:'#345177'}}>Gestion de incidencias de Manteniminento</Text>
      </View>
      <View style={{padding:25}}>
        <TextInput
          onChangeText={ (value) => setEmail(value) }
          value={ email }
          label="Correo electronico"
          mode="outlined"
          underlineColor="transparent" />
        <TextInput
          onChangeText={ (value) => setPassword(value) }
          value={ password }
          style={{marginTop:10}}
          label="Contraseña"
          mode="outlined"
          underlineColor="transparent" />
        <Button mode="contained"  style={{marginTop:15}} onPress={onSubmit}>
          INICIAR SESIÓN
        </Button>
          <Button  style={{marginTop:15}} onPress={forgot}>
              OLVIDE MI CONTRASEÑA
          </Button>
      </View>
    </SafeAreaView>
  );
}
