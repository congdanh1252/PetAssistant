import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import Guide from '../models/guide';

const SavedGuideListScreen = ({route, navigation}) => {
    const [guides, setGuides] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [saveList, setSaveList] = useState([]);

    const filterListBySearch = (input) => {
        var newList = [];
        dataList.forEach(guide => {
            if (guide.title.toLowerCase().includes(input.toLowerCase())) {
                newList.push(guide);
            }
        });
        setGuides(newList);
    }

    //get list guides saved
    useEffect(() => {
        const subscribe = firestore()
        .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/guides')
        .onSnapshot(querySnapshot => {
            var guide_list = new Array();
            querySnapshot.forEach(documentSnapshot => {
                guide_list.push(documentSnapshot.data().id);
            })
            setSaveList(guide_list);
        })
        
        return () => subscribe();
    }, []),

    //load list guide
    useEffect(() => {
        const subscriber = firestore()
        .collection('camnang')
        .onSnapshot(querySnapshot => {
            var guideList = new Array();
            querySnapshot.forEach(documentSnapshot => {
                if (saveList.includes(documentSnapshot.id)) {
                    var guide = new Guide();
                    guide.update(documentSnapshot.data());
                    guide._id = documentSnapshot.id;
                    guideList.push(guide);
                }
            });
            setGuides(guideList);
            setDataList(guideList);
        });

        return () => subscriber();
    }, [saveList]);

    const GuideList = () => {
        var guideList = [];
        for (let i = 0; i < guides.length; i++) {
            guideList.push(
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    style={style.guide_holder}
                    onPress={() => {
                        navigation.navigate('GuideDetail', {
                            guide_id: guides[i]._id
                        })
                    }}
                >
                    <Image
                        style={style.guide_thumbnail}
                        source={{uri: guides[i].thumbnail}}
                    />

                    <View style={style.guide_info_holder}>
                        <Text style={style.guide_title}>{guides[i].title}</Text>
                        <Text style={style.guide_rating_label}>Hữu ích: {guides[i].rating} ❤️</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        
        return (
            <ScrollView
                style={style.guide_list_container}
                showsVerticalScrollIndicator={false}
            >
                {guideList}
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

                <Text style={style.headerTitle}>{strings.saved}</Text>
            </View>

            <View style={style.container}>
                <TextInput
                    style={style.input}
                    placeholder={strings.find}
                    onChangeText={(value) => {
                        filterListBySearch(value)
                    }}
                />
                
                {
                    guides.length == 0 ?
                    <Text
                        style={[style.guide_rating_label, {
                            marginTop: 40,
                            textAlign: 'center',
                        }]}
                    >
                        {strings.msg_saved_guide_list_empty}
                    </Text>
                    :
                    <GuideList/>
                }
            </View>
        </View>
    );
}

export default SavedGuideListScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%',
        paddingTop: 22,
        paddingLeft: 22,
        paddingRight: 22,
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
    saved_button : {
        height: 30,
        width: 30,
        marginTop: 8,
    },
    input: {
        width: '100%',
        height: 46,
        fontSize: 16,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        marginTop: 28,
    },
    guide_list_container: {
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: '22%',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    guide_holder: {
        height: 128,
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 4,
        shadowRadius: 10,
        backgroundColor: COLORS.white,
    },
    guide_thumbnail: {
        height: 128,
        width: '40%',
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
    },
    guide_info_holder: {
        height: '100%',
        width: '60%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    guide_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
    },
    guide_rating_label: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
    },
});