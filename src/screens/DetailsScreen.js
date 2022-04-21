import * as React from 'react';
import { View, FlatList, Image } from 'react-native';
import {AuthContext} from '../util/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Paragraph, TextInput, Title } from 'react-native-paper';
import instance from '../axios/axios';
import { useEffect, useState } from 'react';
import {AirbnbRating, Rating} from 'react-native-ratings';
import Dialog from 'react-native-dialog';
import DialogInput from 'react-native-dialog/lib/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Comments} from "../components/Comments";

export function DetailsScreen({route}) {
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(!visible);
  };
  const comment = {
    id:1,
    description: '',
    user:{
      person:{
        name: '',
        surname: '',
        secondSurname:'',
      },
    },
    time: '',
  };
  const ind = {
    id:0,
    description: '',
    pictureIncidence: '',
    experience:{
      description: '',
      score: 0,
    },
    status: {
      id: 1,
      description: '',
    },
    technical:{
      person:{
        name: '',
        surname: '',
        secondSurname:'',
      },
    },
    dateRegistered: '',
    comments: new Array(comment),
  };
  let userComment = {
    description: '',
    time: '',
    incidence:0,
    token: '',
  };
  let experience = {
    score:0,
    description: '',
  };
  const { id } = route.params;
  const {signOut} = React.useContext(AuthContext);
  const [incidencia, setIncidencia] = useState(ind);
  const [com, setCom] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const saveComment = async () => {
    userComment.description = com;
    userComment.time = '';
    userComment.incidence = incidencia.id;
    userComment.token = await AsyncStorage.getItem('token');
    instance.post('comment/save',userComment)
        .then(res=>{
          showDialog();
          findById(id);
        })
        .catch(()=>{
        });
  };
  const findById = async (incidenciaId) =>{
    const roleName = await AsyncStorage.getItem('role-name');
    setRole(roleName);
    await instance.get('incidence/' + incidenciaId)
        .then(res=>{
          setIncidencia(res.data.data);
        })
        .catch(()=>{
        });
  };
  const saveExperience = async (idItem) => {
    experience.score = rating;
    experience.description = description;
    console.log(experience)
    instance.post('experience/'+Number(idItem),experience)
        .then(res=>{
          console.log(res);
          setIncidencia(res.data.data);
        })
        .catch(err=>{
          console.log(err);
        });
  };
  const updateStatus = async (idIncidencia, idStatus)=> {
    await instance.put('incidence/' + idIncidencia + '/' + idStatus)
        .then(res=>{
          setIncidencia(res.data.data);
        })
        .catch(()=>{
        });
  };


  useEffect(()=>{
    findById(id);
  }, [id]);

  return (
      <SafeAreaView>
        <Button  onPress={signOut} >Cerrar sesión</Button>
        <View>
          <View style={{padding:5}}>
            <Card mode={'outlined'} style={{borderWidth: 1,
              borderTopLeftRadius: 10}}>
              <Image style={{width: '100%' ,
                height: 125,
              }}  source={{
                uri: `data:image/png;base64, ${incidencia.pictureIncidence}`,
              }}/>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                  <AirbnbRating
                      reviews={['Muy malo', 'Malo', 'Regular', 'Bien', 'Muy bien']}
                      count={5}
                      defaultRating={incidencia?.experience?.score ? incidencia.experience.score : 0}
                      onFinishRating={(rating)=>{
                        setRating(rating);
                      }}
                      size={15}
                      readonly={true}
                  />
                  <Paragraph
                      style={{color: incidencia.status.description === 'Abierta' ? 'green'
                            : incidencia.status.description === 'En proceso' ? 'blue' :
                                incidencia.status.description === 'Terminada' ? 'red' : 'gray'}}>Estado: {incidencia.status.description}</Paragraph>
                </View>
                <View >
                  <Paragraph>{incidencia?.experience?.description}</Paragraph>
                  <Paragraph>Incidencia: {incidencia.description}</Paragraph>
                  <Paragraph >Tecnico asigando: {incidencia.technical.person.name} {incidencia.technical.person.surname}
                    {incidencia.technical.person.secondSurname}</Paragraph>
                </View>
                {(role === 'tecnico' && incidencia.status.id === 2) || (role === 'cliente' && incidencia.status.id === 3)?
                    <Button onPress={()=>{
                      updateStatus(incidencia.id, incidencia.status.id);
                    }} disabled={ incidencia.status.id >= 4}>
                      Finalizar incidencia
                    </Button>:null}

                {incidencia.status.id === 4 && role === 'cliente' && !incidencia.experience ?
                    <View>
                      <TextInput
                          mode="outlined"
                          label="Descripción"
                          value={description}
                          onChangeText={description => setDescription(description)}
                      />
                      <Button onPress={()=>{
                        saveExperience(incidencia.id);
                      }}>
                        Calificar
                      </Button>
                    </View>
                    : null
                }
              </Card.Content>
            </Card>

          </View>
          <View>
            <Dialog.Container visible={visible}>
              <Dialog.Title>Agregar comentario</Dialog.Title>
              <DialogInput  onChangeText={ (value) => setCom(value) } label="Comentario"/>
              <Dialog.Button label="Cancelar" onPress={showDialog} />
              <Dialog.Button label="Comentar" onPress={saveComment}/>
            </Dialog.Container>
          </View>
        </View>
        <Card>
          <Card.Content>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Title>Comentarios</Title>
              <Button onPress={showDialog} >
                AGREGAR COMENTARIO
              </Button>
            </View>
            <Comments comments={incidencia.comments}/>
          </Card.Content>
        </Card>
      </SafeAreaView>
  );
}
