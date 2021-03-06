import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
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
    const [dataList, setDataList] = useState([]);
    const [filter, setFilter] = useState(0);

    const snapPoints = useMemo(() => ['35%', '35%'], []);

    const getGuideListOrderByRating = (filter) => {
        const subscribe =
        firestore()
        .collection('camnang')
        .orderBy('rating', filter)
        .get()
        .then(querySnapshot => {
            var guideList = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var guide = new Guide();
                guide.update(documentSnapshot.data());
                guide._id = documentSnapshot.id;
                guideList.push(guide);
            });
            setGuides(guideList);
        });
    }

    const getGuideListOrderByTime = (filter) => {
        const subscribe =
        firestore()
        .collection('camnang')
        .orderBy('day_upload', filter)
        .get()
        .then(querySnapshot => {
            var guideList = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var guide = new Guide();
                guide.update(documentSnapshot.data());
                guide._id = documentSnapshot.id;
                guideList.push(guide);
            });
            setGuides(guideList);
        });
    }

    const filterListBySearch = (input) => {
        var newList = [];
        dataList.forEach(guide => {
            if (guide.title.toLowerCase().includes(input.toLowerCase())) {
                newList.push(guide);
            }
        });
        setGuides(newList);
        input == "" ? setFilter('') : setFilter(filter);
    }

    //load list guide
    useEffect(() => {
        const subscriber = firestore()
        .collection('camnang')
        .onSnapshot(querySnapshot => {
            var guideList = new Array();
            setFilter('');
            querySnapshot.forEach(documentSnapshot => {
                var guide = new Guide();
                guide.update(documentSnapshot.data());
                guide._id = documentSnapshot.id;
                guideList.push(guide);
            });
            setGuides(guideList);
            setDataList(guideList);
        });

        return () => subscriber();
    }, []);

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
                        <Text style={style.guide_rating_label}>H???u ??ch: {guides[i].rating} ??????</Text>
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
                    onPress={() => {
                        navigation.navigate('SavedList');
                    }}
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
                    onChangeText={(value) => {
                        filterListBySearch(value)
                    }}
                />

                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        setShow(true)
                    }}
                    style={{width: 70}}
                >
                    <Text style={style.title}>{strings.sort}</Text>
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
                                onClose={() => {setShow(false)}}
                            >
                                {/* H???u ??ch gi???m */}
                                <TouchableHighlight
                                    key={1}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != 1
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        getGuideListOrderByRating('desc');
                                        setShow(false)
                                        setFilter(1)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_desc_sort}
                                    </Text>
                                </TouchableHighlight>

                                {/* H???u ??ch t??ng */}
                                <TouchableHighlight
                                    key={2}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != 2
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        getGuideListOrderByRating('asc')
                                        setShow(false)
                                        setFilter(2)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_asc_sort}
                                    </Text>
                                </TouchableHighlight>

                                {/* Ng??y c?? nh???t */}
                                <TouchableHighlight
                                    key={3}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != 3
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        getGuideListOrderByTime('desc');
                                        setShow(false)
                                        setFilter(3)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.time_desc_sort}
                                    </Text>
                                </TouchableHighlight>

                                {/* Ng??y m???i nh???t */}
                                <TouchableHighlight
                                    key={4}
                                    activeOpacity={0.7}
                                    underlayColor='#EEEEEE'
                                    style={
                                        filter != 4
                                        ?
                                        style.dropdown_option
                                        :
                                        [style.dropdown_option, {backgroundColor: COLORS.grey}]
                                    }
                                    onPress={() => {
                                        getGuideListOrderByTime('asc')
                                        setShow(false)
                                        setFilter(4)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.time_asc_sort}
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