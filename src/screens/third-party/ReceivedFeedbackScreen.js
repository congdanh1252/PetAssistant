import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'

import BackButton from '../../components/BackButton'
import thirdParty from '../../models/thirdParty'
import COLORS from '../../theme/colors'
import strings from '../../data/strings'
import { windowHeight } from '../../models/common/Dimensions'

const ReceivedFeedbackScreen = ({route, navigation}) => {
    const { obj_id } = route.params
    const [currentRating, setCurrentRating] = useState('')
    const [list, setList] = useState([])
    const [emptyMsg, setEmptyMsg] = useState('Hiện chưa có feedback nào!')

    const rating = ['5', '4', '3', '2', '1']

    //load list items
    useEffect(() => {
        const subscriber = firestore()
        .collection('thirdParty')
        .doc(obj_id)
        .onSnapshot(documentSnapshot => {
            var doubl = new Array();
            var item = new thirdParty();
            item.update(documentSnapshot.data());
            item._id = documentSnapshot.id;
            if (item.feedback) {
                item.feedback.forEach((e) => {
                    if (currentRating != '') {
                        if (e.rating == currentRating)
                            doubl.push(e)
                    } else {
                        doubl.push(e)
                    }
                })
            }

            item.feedback ? setList(doubl) : null;
        })

        return () => subscriber();
    }, [currentRating])

    const FeedbackList = () => {    
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
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
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>Phản hồi đã nhận</Text>
            </View>

            <View style={style.container}>
                <View style={style.rating_boxes_holder}>
                    {
                        rating.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item}
                                    activeOpacity={0.7}
                                    style={
                                        currentRating == item ? 
                                        [style.rating_box, {backgroundColor: COLORS.dark}]
                                        : style.rating_box
                                    }
                                    onPress={() => {
                                        if (currentRating == item) {
                                            setCurrentRating('')
                                        } else {
                                            setCurrentRating(item)
                                        }
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: currentRating==item?'#fff':'#000',
                                            fontSize: 17,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {item} ⭐
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

                <FeedbackList/>
            </View>
        </View>
    );
}

export default ReceivedFeedbackScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        height: windowHeight / 2 + 32,
        backgroundColor: COLORS.white
    },
    container: {
        height: windowHeight - 110,
        paddingTop: 22,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 22,
        marginTop: -20,
        marginBottom: 20,
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
    rating_boxes_holder: {
        height: 52,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rating_box: {
        height: 40,
        width: 70,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey
    }
});