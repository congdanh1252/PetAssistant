import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import BottomSheet from '@gorhom/bottom-sheet';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import Guide from '../models/guide';

const GuideListScreen = ({route, navigation}) => {
    const [show, setShow] = useState(false);
    const [guides, setGuides] = useState([]);

    const snapPoints = useMemo(() => ['19%', '19%'], []);

    const handleGuides = (list) => {
        setGuides(list);
    }

    //load list guide
    useEffect(() => {
        const subscriber = firestore()
        .collection('camnang')
        .onSnapshot(querySnapshot => {
            var guideList = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var guide = new Guide();
                guide.update(documentSnapshot.data());
                guide._id = documentSnapshot.id;
                guideList.push(guide);
            });
            setGuides(guideList);
        });

        return () => subscriber();
    }, [show]);

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

                <Text style={style.headerTitle}>{strings.guide}</Text>

                <TouchableOpacity
                    style={style.saved_button}
                    activeOpacity={0.6}
                >
                    <Image
                        style={style.saved_button}
                        source={require('../assets/icons/Hamburger.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={style.container}>
                <TextInput
                    style={style.input}
                    placeholder={strings.find}
                />

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        setShow(true)
                    }}
                    style={{width: 70}}
                >
                    <Text style={style.title}>{strings.filter}</Text>
                </TouchableOpacity>
                
                <GuideList/>
            </View>

            {/* BottomSheet Filter */}
            {
                !show ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => {setShow(false)}}>
                        <View style={style.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={snapPoints}
                                backgroundStyle={{borderWidth: 1}}
                                style={style.dropdown_bottomsheet}
                                enableOverDrag={false}
                                enablePanDownToClose={true}
                                onClose={() => setShow(false)}
                            >
                                <TouchableHighlight
                                    key={1}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        style.dropdown_option
                                    }
                                    onPress={() => {

                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_desc_filter}
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    key={2}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        style.dropdown_option
                                    }
                                    onPress={() => {

                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_asc_filter}
                                    </Text>
                                </TouchableHighlight>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
}

export default GuideListScreen;

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
        fontSize: 24,
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
        fontSize: 20,
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
        fontSize: 18,
    },
    guide_rating_label: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_option: {
        width: '99%',
        height: 60,
        padding: 24,
        alignSelf: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1.5,
        borderColor: COLORS.grey,
    },
    dropdown_option_text: {
        color: COLORS.black,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
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