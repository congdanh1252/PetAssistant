import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, Keyboard, FlatList,
} from 'react-native';
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from "react-native-image-picker";

import {
    addNewMessageToChat,
    getChatId,
    addNewChat,
    deleteChat
} from '../api/ChatAPI';
import { uploadImageToStorage } from '../api/PetAPI';
import Message from '../models/message';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowWidth, windowHeight } from '../models/common/Dimensions'

const ChatScreen = ({route, navigation}) => {
    const [chatId, setChatId] = useState('');
    const { obj_id, obj_name, obj_avt } = route.params;
    const [chatUser, setChatUser] = useState({
        id: obj_id,
        name: obj_name,
        photo: obj_avt
    });
    const [draft, setDraft] = useState('');
    const [pickingPhoto, setPickingPhoto] = useState(false);
    const [photoUri, setPhotoUri] = useState('none');
    const [photoFileName, setPhotoFileName] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const handleDeleteButton = () => {
        deleteChat(chatId, (res) => {
            if (res == 'Success') {
                Toast.show({
                    type: 'success',
                    text1: strings.success,
                    text2: 'Đã xóa đoạn chat! 🖐',
                    position: 'top',
                    autoHide: true,
                });

                navigation.goBack();
            }
        })
    }

    const handleChatId = (result) => {
        if (result == 'empty') {
            setChatId('');
        }
        else {
            setChatId(result);
        }
    }

    const checkExistedChat = () => {
        return chatId == '' ? false : true;
    }

    const handleMessageSent = (result) => {
        setIsSending(false)
        setDraft('');
        setPickingPhoto(false);
        setPhotoUri('none');
        setPhotoFileName('');
    }

    const sendMessage = (cId) => {
        if (photoUri != 'none' && pickingPhoto) {
            uploadImageToStorage(photoUri, photoFileName, (url) => {
                addNewMessageToChat('', url, cId, handleMessageSent)
            })
        } else {
            addNewMessageToChat(draft, '', cId, handleMessageSent)
        }
    }

    const handleSendMessage = () => {
        if (draft != '' || photoUri != 'none') {
            setIsSending(true)

            if (!checkExistedChat()) {
                addNewChat(obj_id, obj_name, obj_avt, (result) => {
                    // getChatId(obj_id, handleChatId)
                    setChatId(result)
                    sendMessage(result)
                })
            }
            else {
                sendMessage(chatId)
            }
        }
    }

    const pickPhoto = () => {
        let options = {
            selectionLimit: 1,
            mediaType: 'photo',
        }

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                setPickingPhoto(false)
                console.log('User cancelled image picker');
            }
            else if (response.errorCode == 'permission') {
                console.log(strings.err_photo_picker_permission);
            }
            else {
                setPhotoUri(response.assets[0].uri);
                setPhotoFileName(response.assets[0].fileName);
                console.log(response.assets[0].fileName);
            }
        })
    }

    const handleRemovePickedPhoto = () => {
        setPhotoUri('none')
        setPickingPhoto(false)
    }

    const renderItem = ({ item }) => {
        return (
            item.sender == chatUser.id ?
            (
                // service person message
                <View key={item._id}>
                    {
                        item.attachment!="" ? 
                        null :
                        <View style={style.service_msg_container}>
                            <Image
                                source={{uri: chatUser.photo}}
                                style={style.user_photo}
                            />

                            <View style={style.service_msg_holder}>
                                <Text style={style.service_msg_text}>{item.detail}</Text>
                            </View>
                        </View>
                    }

                    {/* photo */}
                    {
                        item.attachment=="" ? 
                        null :
                        <View style={style.service_msg_container}>
                            <Image
                                source={{uri: chatUser.photo}}
                                style={style.user_photo}
                            />

                            <View style={style.service_msg_holder}>
                                <Image
                                    source={{uri: item.attachment}}
                                    style={style.msg_attachment}
                                    resizeMode='contain'
                                />
                            </View>
                        </View>
                    }
                </View>
            )
            :
            (
                //own message
                <View key={item._id}>
                    {
                        item.attachment!="" ? 
                        null :
                        <View style={style.own_msg_holder}>
                            <Text style={style.own_msg_text}>{item.detail}</Text>
                        </View>
                    }
                    
                    {/* image message */}
                    {
                        item.attachment=="" ? 
                        null :
                        <View style={style.own_msg_holder}>
                            <Image
                                source={{uri: item.attachment}}
                                style={style.msg_attachment}
                                resizeMode='contain'
                            />
                        </View>
                    }
                </View>
            )
        )
    };

    //get chat id
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            const subscribe = getChatId(obj_id, handleChatId);
        }
        
        return () => isMounted = false;
    }, []),

    //load all chat messages
    useEffect(() => {
        if (chatId != '') {
        const subscriber = firestore()
            .collection('chat/' + chatId + '/messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                var messages = new Array();
                querySnapshot.forEach(documentSnapshot => {
                    var msg = new Message();
                    msg.update(documentSnapshot.data());
                    msg._id = documentSnapshot.id;
                    messages.push(msg);
                });
                setMessages(messages);
            });

            return () => subscriber();
        }
    }, [chatId]);

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle} numberOfLines={2}>{chatUser.name}</Text>

                {
                    chatId != '' ?
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
                    : null
                }
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={style.container}>
                    {/* Chat messages area */}
                    <FlatList
                        inverted
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.messages_container}
                    />

                    {/* Keyboard area */}
                    <View style={
                            !pickingPhoto ?
                            style.bottom_stack_holder :
                            [style.bottom_stack_holder, {height: windowHeight / 4}]
                        }
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                pickPhoto()
                                setPickingPhoto(true)
                            }}
                        >
                            <Image
                                style={{
                                    width: 34,
                                    height: 34,
                                }}
                                source={require('../assets/icons/Add.png')}
                            />
                        </TouchableOpacity>

                        {
                            !pickingPhoto ?
                            <TextInput
                                style={style.input}
                                placeholder={strings.type_something_msg}
                                multiline={true}
                                returnKeyType={'done'}
                                value={draft}
                                onChangeText={(value) => {
                                    setDraft(value);
                                }}
                            /> :

                            <View style={style.picked_photo_holder}>
                                {
                                    photoUri == 'none' ?
                                        null :
                                        <Image
                                            style={style.picked_photo}
                                            source={{uri: photoUri}}
                                        />
                                }

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={style.remove_photo_button}
                                    onPress={() => handleRemovePickedPhoto()}
                                >
                                    <Text style={{color: '#fff', fontSize: 20}}> —</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            isSending ?
                                <ActivityIndicator size="small" color="#000" />
                            :
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={style.send_button}
                                    onPress={() => {
                                        handleSendMessage()
                                    }}
                                >
                                    <Text style={style.title}>GỬI</Text>
                                </TouchableOpacity>
                        }
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
        // justifyContent: 'flex-end'
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
    picked_photo: {
        height: '100%',
        width: '90%',
        borderRadius: 10
    },
    picked_photo_holder: {
        height: windowHeight / 4,
        width: windowWidth - 148,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
    },
    remove_photo_button : {
        position: 'absolute',
        top: 4,
        right: 14,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.black
    },
    send_button: {
        width: 40,
        alignItems: 'center',
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
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
        maxWidth: windowWidth - 98,
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