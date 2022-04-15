import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import thirdParty from '../models/thirdParty';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import { windowHeight } from '../models/common/Dimensions';

const ServiceItemListTab = ({route, navigation}) => {
    const { obj_id } = route.params;
    const [expand, setExpand] = useState([0,0,0,0,0,0,0,0]);
    const [list, setList] = useState([]);

    const getExpandStatus = (arr) => {
        expand.forEach(element => {
            arr.push(element);
        });
    }

    //load list items
    useEffect(() => {
        const subscriber = firestore()
        .collection('thirdParty')
        .doc(obj_id)
        .onSnapshot(documentSnapshot => {
            var item = new thirdParty();
            item.update(documentSnapshot.data());
            item._id = documentSnapshot.id;

            setList(item.service);
        })

        return () => subscriber();
    }, [])

    const ItemList = () => {    
        return (
            <ScrollView style={style.screen} showsVerticalScrollIndicator={false}>
                {
                    list.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => {
                                    let arr = [];
                                    getExpandStatus(arr);
                                    arr[index] = 1 - arr[index];

                                    setExpand(arr);
                                }}
                            >
                                <View
                                    style={
                                        expand[index]==0 ?
                                        style.item_holder : [style.item_holder, { height: 162 }]
                                    }
                                >
                                    {/* Title + arrow icon */}
                                    <View style={style.inline_holder}>
                                        <Text style={style.item_title}>
                                            {item.detail} - {item.price} VNĐ
                                        </Text>
                                        
                                        <Image
                                            source={require('../assets/icons/Back.png')}
                                            style={
                                                expand[index]==0 ?
                                                style.down_icon : style.horiz_icon
                                            }
                                        />
                                    </View>

                                    {/* description */}
                                    {
                                        expand[index] == 1 ?
                                        (
                                            <View style={style.inline_holder}>
                                                <Text style={style.item_description} numberOfLines={3}>
                                                    {item.description}
                                                </Text>
                                            </View>
                                        )
                                        : null
                                    }

                                    {/* book button */}
                                    {
                                        expand[index] == 1 ?
                                        (
                                            <View style={style.inline_holder}>
                                                <View style={[style.book_button, {backgroundColor: 'white'}]}>

                                                </View>

                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={style.book_button}
                                                    onPress={() => {
                                                        navigation.navigate('MakeAppointment', {
                                                            action: 'add',
                                                            thirdPartyID: obj_id,
                                                            currentService: item.detail
                                                        })
                                                    }}
                                                >
                                                    <Text style={style.button_text}>{strings.book_service_label}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                        : null
                                    }
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        )
    }

    //Main 
    return (
        <ItemList/>
    );
}

export default ServiceItemListTab;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        height: windowHeight / 2 + 90,
        backgroundColor: COLORS.white
    },
    list_container: {
        width: '100%',
        backgroundColor: COLORS.white
    },
    item_holder: {
        height: 70,
        width: '100%',
        borderRadius: 10,
        marginTop: 8,
        padding: 12,
        borderWidth: 3,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderColor: COLORS.grey,
    },
    inline_holder: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
    },
    item_description: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
    },
    down_icon: {
        width: 26,
        height: 26,
        transform: [{
            rotateZ: '-90deg',
        }],
        tintColor: COLORS.black
    },
    horiz_icon: {
        width: 26,
        height: 26,
        transform: [{
            rotateZ: '0deg',
        }],
        tintColor: COLORS.black
    },
    book_button: {
        height: 40,
        width: 84,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.black,
    },
    button_text: {
        color: COLORS.white,
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
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