import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowWidth } from '../models/common/Dimensions';

const ChatListScreen = ({route, navigation}) => {
    const [chats, setChats] = useState([]);
    const [filter, setFilter] = useState(0);
    const list = [
        {
            chat_id: "id1",
            user_id: "id",
            username: "Phòng khám Zoey",
            photo_url: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            last_message: "alo bạn đâu rồi?",
            send_time: "5 phút",
            is_read: "false",
        },
        {
            chat_id: "id2",
            user_id: "id",
            username: "Phòng khám Zoey",
            photo_url: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            last_message: "alo bạn đâu rồi?",
            send_time: "5 phút",
            is_read: "true",
        },
        {
            chat_id: "id3",
            user_id: "id",
            username: "Phòng khám Zoey",
            photo_url: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            last_message: "alo bạn đâu rồi?",
            send_time: "5 phút",
            is_read: "true",
        }
    ];

    //load list chat
    useEffect(() => {
        // const subscriber = firestore()
        // .collection('camnang')
        // .onSnapshot(querySnapshot => {
        //     var guideList = new Array();
        //     setFilter('');
        //     querySnapshot.forEach(documentSnapshot => {
        //         var guide = new Guide();
        //         guide.update(documentSnapshot.data());
        //         guide._id = documentSnapshot.id;
        //         guideList.push(guide);
        //     });
        //     setGuides(guideList);
        //     setDataList(guideList);
        // });

        // return () => subscriber();
    }, []);

    const ChatList = () => {    
        return (
            <ScrollView
                style={style.chat_list_container}
                showsVerticalScrollIndicator={false}
            >
                {
                    list.map((item) => {
                        return (
                            <TouchableHighlight
                                key={item.chat_id}
                                underlayColor={'#EEEEEE'}
                                onPress={() => {

                                }}
                            >
                                <View style={style.chat_holder}>
                                    <Image
                                        source={{uri: item.photo_url}}
                                        resizeMode={'cover'}
                                        style={style.user_photo}
                                    />

                                    <View style={style.chat_information_holder}>
                                        <View style={style.username_time_holder}>
                                            <Text
                                                numberOfLines={1}
                                                style={[style.text, {width: '82%'}]}
                                            >
                                                {item.username}
                                            </Text>

                                            <Text style={style.text}>{item.send_time}</Text>
                                        </View>

                                        <Text
                                            style={
                                                item.is_read=='false'
                                                ?
                                                style.unseen_msg : style.text
                                            }
                                            numberOfLines={1}
                                        >
                                            {item.last_message}
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
        flexWrap: 'wrap',
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