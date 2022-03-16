import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import { windowHeight } from '../models/common/Dimensions';

const ServiceItemListTab = ({route, navigation}) => {
    const obj_id = "";
    const list = [
        {
            id: "id1",
            detail: "Khám tổng quát",
            price: "50.000",
            description: "",
        },
        {
            id: "id2",
            detail: "Tiêm ngừa",
            price: "100.000",
            description: "",
        },
        {
            id: "id3",
            detail: "Truyền nước biển",
            price: "20.000",
            description: "",
        },

        {
            id: "id17",
            detail: "Khám tổng quát",
            price: "50.000",
            description: "",
        },
        {
            id: "id27",
            detail: "Tiêm ngừa",
            price: "100.000",
            description: "",
        },
        {
            id: "id37",
            detail: "Truyền nước biển",
            price: "20.000",
            description: "",
        },
        {
            id: "id18",
            detail: "Khám tổng quát",
            price: "50.000",
            description: "",
        },
        {
            id: "id28",
            detail: "Tiêm ngừa",
            price: "100.200",
            description: "",
        },
    ];

    //load list items
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

    const ItemList = () => {    
        return (
            <ScrollView style={style.screen} showsVerticalScrollIndicator={false}>
                {
                    list.map((item) => {
                        return (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.7}
                                onPress={() => {

                                }}
                            >
                                <View style={style.item_holder}>
                                    <Text style={style.item_title}>
                                        {item.detail} - {item.price} VNĐ
                                    </Text>
                                    
                                    <Image
                                        source={require('../assets/icons/Back.png')}
                                        style={style.down_icon}
                                    />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderColor: COLORS.grey,
    },
    item_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 17,
    },
    down_icon: {
        width: 26,
        height: 26,
        transform: [{
            rotateZ: '-90deg',
        }],
        tintColor: COLORS.black
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