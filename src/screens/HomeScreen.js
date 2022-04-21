import * as React from 'react';
import { View, FlatList, Image } from 'react-native';
import {AuthContext} from '../util/utils';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import axios from '../axios/axios';

export function HomeScreen({navigation}) {
  const {signOut} = React.useContext(AuthContext);
  const [page, setPage] = React.useState(10);
  const [incidence, setIncidence] = React.useState();


  const getAll = async (numberPage) => {
    const res = await axios.get('incidence/all', {
      params: {page: numberPage},
    });
    setIncidence(res.data);
  };
  React.useEffect(() => {
    getAll(page);
  }, [page]);

  const loadMoreData = () => {
    if(!incidence?.data.last){
     setPage(page + 10)
    }
  };

  return (
    <View style={{height: '100%'}}>
      <Button  onPress={signOut} >Cerrar sesión</Button>
        <FlatList style={{paddingBottom: 20}} data={incidence?.data.content}
                  renderItem={({item}) =>
                    <View style={{padding:5}}>
                      <Card mode={'outlined'} style={{borderWidth: 1,
                        borderTopLeftRadius: 10}} onPress={()=>{
                          navigation.navigate('Details', {id:item.id});
                      }}>
                        <Image style={{width: '100%' ,
                          height: 100,
                        }}  source={{
                          uri: `data:image/png;base64, ${item.pictureIncidence}`,
                        }}/>
                        <Card.Content>
                          <Title>{item.description}</Title>
                          <Paragraph>Tecnico asigando: {item.technical.person.name} {item.technical.person.surname}
                          </Paragraph>
                          <Paragraph>Estado: {item.status.description} </Paragraph>
                        </Card.Content>
{/*                        <Card.Actions>
                          <Button color="#00AB84" mode={'text'}
                                  onPress={()=>{
                                    navigation.navigate('Details', {id:item.id});
                                  }}
                          >VER INCIDENCIA</Button>

                        </Card.Actions>*/}
                      </Card>
                    </View>
                  }
          // @ts-ignore
                  keyExtractor={item => item.id} onEndReachedThreshold={1}
                  onEndReached={loadMoreData} />
    </View>
  );
}
