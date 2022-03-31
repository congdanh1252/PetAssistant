import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TextInput, TouchableHighlight
} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

import Chat from '../models/chat';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowWidth } from '../models/common/Dimensions';

const ChatListScreen = ({route, navigation}) => {
    const [chats, setChats] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [filter, setFilter] = useState('');

    const filterListBySearch = (input) => {
        var newList = [];
        dataList.forEach(item => {
            if (item.user2Name.toLowerCase().includes(input.toLowerCase())) {
                newList.push(item);
            }
        });
        setChats(newList);
        input == "" ? setFilter('') : setFilter(filter);
    }

    //load list chat
    useEffect(() => {
        const subscriber = firestore()
        .collection('chat')
        .onSnapshot(querySnapshot => {
            var list = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var chat = new Chat();
                chat.update(documentSnapshot.data());
                chat._id = documentSnapshot.id;
                chat.createdAt = new Date(documentSnapshot.data().createdAt.toDate());
                chat.updatedAt = new Date(documentSnapshot.data().updatedAt.toDate());
                chat.user2Name = documentSnapshot.data().user2Name;
                chat.photoUrl = documentSnapshot.data().user2Image;

                list.push(chat);
            });
            setChats(list);
            setDataList(list);
        });

        return () => subscriber();
    }, []);

    const ChatList = () => {    
        return (
            <ScrollView
                style={style.chat_list_container}
                showsVerticalScrollIndicator={false}
            >
                {
                    chats.map((item) => {
                        return (
                            <TouchableHighlight
                                key={item._id}
                                underlayColor={'#EEEEEE'}
                                onPress={() => {
                                    navigation.navigate('ChatScreen', {
                                        obj_id: item.user2,
                                        obj_name: item.user2Name,
                                        obj_avt: item.photoUrl
                                    })
                                }}
                            >
                                <View style={style.chat_holder}>
                                    <Image
                                        source={{uri: item.photoUrl}}
                                        resizeMode={'cover'}
                                        style={style.user_photo}
                                    />

                                    <View style={style.chat_information_holder}>
                                        <View style={style.username_time_holder}>
                                            <Text
                                                numberOfLines={1}
                                                style={[style.text, {width: '82%', fontWeight: 'bold'}]}
                                            >
                                                {item.user2Name}
                                            </Text>

                                            <Text style={style.text}>
                                                {
                                                    moment(item.createdAt).fromNow()
                                                    .substring(
                                                        0,
                                                        moment(item.createdAt).fromNow().lastIndexOf(' ')
                                                    )
                                                }
                                            </Text>
                                        </View>

                                        <Text
                                            style={
                                                item.is_read=='false'
                                                ?
                                                style.unseen_msg : style.text
                                            }
                                            numberOfLines={1}
                                        >
                                            {item.lastMessage}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        );
                    })
                }
            </ScrollView>
        )
    }

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>{strings.chat_list_label}</Text>
            </View>

            <View style={style.container}>
                <TextInput
                    style={style.input}
                    placeholder={strings.find}
                    onChangeText={(value) => {
                        filterListBySearch(value)
                    }}
                />
                
                <ChatList/>
            </View>
        </View>
    );
}

export default ChatListScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%',
        paddingTop: 22,
        paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 110,
        paddingTop: 16,
        paddingLeft: 8,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    headerTitle: {
        width: '76%',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        marginTop: 16,
        color: COLORS.white,
    },
    input: {
        width: windowWidth - 44,
        height: 46,
        fontSize: 16,
        padding: 12,
        marginLeft: 22,
        marginRight: 22,
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
    },
    chat_list_container: {
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: '22%',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    chat_holder: {
        height: 70,
        marginTop: 4,
        marginBottom: 4,
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    user_photo: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    chat_information_holder: {
        height: '100%',
        width: windowWidth - 110,
        marginLeft: 16,
        paddingTop: 7,
        paddingBottom: 7,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    username_time_holder: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    unseen_msg: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
});