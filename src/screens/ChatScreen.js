import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import Dialog from "react-native-dialog";

import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowWidth, windowHeight } from '../models/common/Dimensions'

const ChatScreen = ({route, navigation}) => {
    const [chatUser, setChatUser] = useState({
        id: 'id1',
        name: 'Phòng khám Zoey',
        photo: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
    });
    const [show, setShow] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "msg1",
            user_id: "user",
            detail: "Hello Zoeyyyyyyyyyyyyyyyyy!",
            attachment: "",
            send_time: "",
        },
        {
            id: "msg2",
            user_id: "id1",
            detail: "How can I help you?",
            attachment: "",
            send_time: "",
        },
        {
            id: "msg3",
            user_id: "user",
            detail: "My dog is sick. Can I book an aid tomorrow?",
            attachment: "",
            send_time: "",
        },
        {
            id: "msg4",
            user_id: "user",
            detail: "",
            attachment: "https://cf.ltkcdn.net/dogs/images/orig/246946-1600x1030-signs-your-dog-might-be-sick.jpg",
            send_time: "",
        },
    ]);

    const handleDeleteButton = () => {

    }

    //load all chat messages
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

    const Messages = () => {
        return (
            <ScrollView style={style.messages_container} showsVerticalScrollIndicator={false}>
                {
                    messages.map((msg) => {
                        return (
                            msg.user_id == chatUser.id ?
                            (
                                // service person message
                                <>
                                    {
                                        msg.attachment!="" ? 
                                        null :
                                        <View style={style.service_msg_container} key={msg.id}>
                                            <Image
                                                source={{uri: chatUser.photo}}
                                                style={style.user_photo}
                                            />

                                            <View style={style.service_msg_holder}>
                                                <Text style={style.service_msg_text}>{msg.detail}</Text>
                                            </View>
                                        </View>
                                    }

                                    {/* photo */}
                                    {
                                        msg.attachment=="" ? 
                                        null :
                                        <View style={style.service_msg_container}>
                                            <Image
                                                source={{uri: chatUser.photo}}
                                                style={style.user_photo}
                                            />

                                            <View style={style.service_msg_holder}>
                                                <Image
                                                    source={{uri: msg.attachment}}
                                                    style={style.msg_attachment}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                        </View>
                                    }
                                </>
                            )
                            :
                            (
                                //own message
                                <>
                                    {
                                        msg.attachment!="" ? 
                                        null :
                                        <View style={style.own_msg_holder} key={msg.id}>
                                            <Text style={style.own_msg_text}>{msg.detail}</Text>
                                        </View>
                                    }
                                    
                                    {/* image message */}
                                    {
                                        msg.attachment=="" ? 
                                        null :
                                        <View style={style.own_msg_holder}>
                                            <Image
                                                source={{uri: msg.attachment}}
                                                style={style.msg_attachment}
                                                resizeMode='contain'
                                            />
                                        </View>
                                    }
                                </>
                            )
                        );
                    })
                }
            </ScrollView>
        );
    }

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>{chatUser.name}</Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        setDialogVisible(true)
                    }}
                >
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                            marginTop: 16,
                            marginLeft: 8,
                            tintColor: COLORS.white
                        }}
                        source={require('../assets/icons/ic_bin.png')}
                    />
                </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={style.container}>
                    {/* Chat messages area */}
                    <Messages/>

                    {/* Keyboard area */}
                    <View style={style.bottom_stack_holder}>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                }}
                                source={require('../assets/icons/Add.png')}
                            />
                        </TouchableOpacity>

                        <TextInput
                            style={style.input}
                            placeholder={strings.type_something_msg}
                            multiline={true}
                            returnKeyType={'done'}
                            onChangeText={(value) => {
                                
                            }}
                        />

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={style.send_button}
                            onPress={() => {
                                
                            }}
                        >
                            <Text style={style.title}>GỬI</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            
            {/* Delete chat dialog */}
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title
                    style={{fontFamily: 'Roboto-Bold', color: COLORS.black}}
                >
                    {strings.delete_chat}
                </Dialog.Title>

                <Dialog.Description style={{color: COLORS.black}}>
                    {strings.delete_chat_msg}
                </Dialog.Description>

                {/* Cancel */}
                <Dialog.Button
                    color={COLORS.black}
                    label={strings.cancel}
                    onPress={() => {
                        setDialogVisible(false);
                    }}
                />

                {/* Sure */}
                <Dialog.Button
                    color={COLORS.black}
                    label={strings.sure}
                    onPress={() => {
                        handleDeleteButton();
                    }}
                />
            </Dialog.Container>
        </View>
    );
}

export default ChatScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: windowHeight - 110,
        paddingTop: 12,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 8,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    messages_container: {
        width: '100%',
        height: windowHeight - 188,
        paddingLeft: 2,
        paddingRight: 2,
        flexGrow: 1,
        justifyContent: 'flex-end'
    },
    bottom_stack_holder: {
        width: '100%',
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    input: {
        width: windowWidth - 148,
        fontSize: 16,
        height: '100%' - 12,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
    },
    send_button: {
        width: 40,
        alignItems: 'center',
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
    },
    own_msg_holder: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        backgroundColor: COLORS.blue
    },
    own_msg_text: {
        color: COLORS.white,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    service_msg_container: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    service_msg_holder: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'flex-start',
        backgroundColor: COLORS.grey
    },
    service_msg_text: {
        color: COLORS.black,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    user_photo: {
        height: 42,
        width: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    msg_attachment: {
        width: windowWidth - (windowWidth / 3),
        height: windowHeight / 5
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