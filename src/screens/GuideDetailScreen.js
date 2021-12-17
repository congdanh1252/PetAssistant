import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowHeight } from '../models/common/Dimensions';
import Guide from '../models/guide';

const GuideDetailScreen = ({route, navigation}) => {
    const [tocs, setToCs] = useState(false);
    const { guide_id } = route.params;
    const [guide, setGuide] = useState(new Guide());

    //load guide detail
    useEffect(() => {
        const subscriber = firestore()
        .collection('camnang')
        .doc(guide_id)
        .onSnapshot(documentSnapshot => {
            var newGuide = new Guide();
            newGuide.update(documentSnapshot.data());
            newGuide._id = documentSnapshot.id;
            setGuide(newGuide);
        });

        return () => subscriber();
    }, [guide_id]);

    const GuideTableOfContents = () => {
        var table_of_contents = [];
        for (let i = 0; i < guide.section.length; i++) {
            table_of_contents.push(
                <Text
                    key={i}
                    style={[style.title, {fontSize: 16}]}
                >
                    {i + 1}. {guide.section[i].title}
                </Text>
            )
        }

        return (
            <View
                style={
                    !tocs 
                    ? 
                    style.tocs_holder : [style.tocs_holder, {height: 25 * (guide.section.length + 2)}]
                }
            >
                {/* Mục lục + Mũi tên */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.tocs_label_holder}
                    onPress={() => {
                        setToCs(!tocs);
                    }}
                >
                    <Text style={style.title}>{strings.table_of_contents}</Text>

                    <Image
                        style={
                            tocs
                            ?
                            style.arrow_down : style.arrow_horiz
                        }
                        source={require('../assets/icons/Back_black.png')}
                    />
                </TouchableOpacity>

                {/* Mục lục chi tiết */}
                {
                    tocs
                    ?
                    <View style={{marginTop: 10}}>
                        {table_of_contents}
                    </View>
                    : null
                }
            </View>
        )
    }

    const GuideDetail = () => {
        var guideDetail = [];
        for (let i = 0; i < guide.section.length; i++) {
            guideDetail.push(
                <View key={i}>
                    <Text style={style.section_title}>{i + 1}. {guide.section[i].title}</Text>
                    <Text style={style.detail_text}>{AddLineBreak(guide.section[i].detail)}</Text>
                    {
                        guide.section[i].image == ""
                        ?
                        (null)
                        :
                        <Image
                            resizeMode='contain'
                            style={style.section_image}
                            source={{uri: guide.section[i].image}}
                        />
                    }
                </View>
            )
        }
        
        return (
            <View style={style.guide_detail_container}>
                {guideDetail}
            </View>
        )
    }

    const AddLineBreak = (text) => {
        return text.replace(/\\n/g, "\n\n");
    }

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>{guide.title}</Text>
            </View>

            <ScrollView
                style={style.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Mục lục */}
                <GuideTableOfContents/>
                
                {/* Nội dung */}
                <GuideDetail/>

                <View style={style.footer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <Text style={style.title}>{strings.helpful_rating}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <View style={style.saved_button}>
                            <Image style={style.saved_icon} source={require('../assets/icons/ic_save.png')}/>

                            <Text style={style.save_label}>Lưu</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

export default GuideDetailScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.white
    },
    container: {
        paddingTop: 22,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 130,
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
        marginTop: 12,
        color: COLORS.white,
    },
    saved_button : {
        height: 44,
        width: 90,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
    },
    saved_icon: {
        width: 30,
        height: 30,
        marginRight: 8
    },
    save_label: {
        fontSize: 17,
        color: COLORS.white
    },
    tocs_holder: {
        width: '100%',
        height: 48,
        fontSize: 16,
        padding: 12,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#EEEEEE',
    },
    tocs_label_holder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    arrow_horiz: {
        transform: [{
            rotateZ: '0deg',
        }]
    },
    arrow_down: {
        transform: [{
            rotateZ: '-90deg',
        }]
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
    },
    section_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        marginTop: 12,
        marginBottom: 2
    },
    detail_text: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 18,
        marginTop: 2,
        marginBottom: 4
    },
    guide_detail_container: {
        marginTop: 24,
    },
    section_image: {
        height: windowHeight / 3,
        width: '100%',
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 8
    },
    footer: {
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 40,
    },
});