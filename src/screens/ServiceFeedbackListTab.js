import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import thirdParty from '../models/thirdParty';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import { windowHeight } from '../models/common/Dimensions';

const ServiceFeedbackListTab = ({route, navigation}) => {
    const { obj_id } = route.params;
    const [list, setList] = useState([]);
    const [emptyMsg, setEmptyMsg] = useState('Hiện chưa có feedback nào!');

    //load list items
    useEffect(() => {
        const subscriber = firestore()
        .collection('thirdParty')
        .doc(obj_id)
        .onSnapshot(documentSnapshot => {
            var item = new thirdParty();
            item.update(documentSnapshot.data());
            item._id = documentSnapshot.id;

            item.feedback ? setList(item.feedback) : null;
        })

        return () => subscriber();
    }, [])

    const FeedbackList = () => {    
        return (
            <ScrollView style={style.screen} showsVerticalScrollIndicator={false}>
                {
                    list.map((item, index) => {
                        return (
                            <View key={index}>
                                <View style={style.item_holder}>
                                    {/* Title + arrow icon */}
                                    <View style={style.inline_holder}>
                                        <Text style={style.item_title}>
                                            {item.username}
                                        </Text>
                                        
                                        <Text style={style.item_title}>
                                            {item.rating} ⭐
                                        </Text>
                                    </View>

                                    {/* description */}
                                    <View style={style.inline_holder}>
                                        <Text style={style.item_description} numberOfLines={3}>
                                            {item.detail} - {item.createdAt}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                }
                {
                    list.length < 1 ?
                    <View style={{width: '100%', marginTop: '50%'}}>
                        <Text
                            style={{
                                color: COLORS.black,
                                fontFamily: 'Roboto-Light',
                                fontStyle: 'italic',
                                fontSize: 16,
                                textAlign: 'center'
                            }}
                        >
                            {emptyMsg}
                        </Text>
                    </View>
                    : null
                }
            </ScrollView>
        )
    }

    //Main 
    return (
        <FeedbackList/>
    );
}

export default ServiceFeedbackListTab;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        height: windowHeight / 2 + 32,
        backgroundColor: COLORS.white
    },
    list_container: {
        width: '100%',
        backgroundColor: COLORS.white
    },
    item_holder: {
        height: 100,
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
});