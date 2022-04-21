import * as React from 'react';
import {View, FlatList, Text} from 'react-native';


export function Comments(comments) {
    return (
        <View>
                <FlatList style={{marginBottom:8000}}
                          data={comments.comments}
                          renderItem={({item}) =>
                              <View style={{padding:5, borderColor: '#E8E8E8', borderWidth:1, borderRadius: 5}}>
                                  <View >
                                      <Text>
                                          {item.user.person.name} {item.user.person.surname} {item.user.person.secondSurname}
                                      </Text>

                                  </View>

                                  <Text>
                                      {item.description}
                                  </Text>
                              </View>
                          }
                          keyExtractor={item => item.id} />
        </View>
    );
}
