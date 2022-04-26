import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, LogBox, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';

import ServiceItemListTab from '.././ServiceItemListTab';
import ServiceFeedbackListTab from '.././ServiceFeedbackListTab';
import thirdParty from '../../models/thirdParty';
import COLORS from '../../theme/colors';
import strings from '../../data/strings';
import BackButton from '../../components/BackButton';
import { windowWidth, windowHeight } from '../../models/common/Dimensions'

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const Tab = createMaterialTopTabNavigator();

const MyTabs = (props) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                    backgroundColor: COLORS.dark
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    textTransform: 'none',
                },
                tabBarPressColor: COLORS.grey,
                tabBarActiveTintColor: COLORS.white,
                tabBarIndicatorStyle: {
                    backgroundColor: COLORS.white
                }
            }}
        >
          <Tab.Screen
            name={strings.service_label}
            component={ServiceItemListTab}
            initialParams={{
                obj_id: props.itemId,
                role: 'third-party' 
            }}
          />
          <Tab.Screen
            name={strings.feedback_label}
            component={ServiceFeedbackListTab}
            initialParams={{
                obj_id: props.itemId,
            }}
          />
        </Tab.Navigator>
    );
}

const ProfileScreen = ({route, navigation}) => {
    const { item_id } = route.params;
    const [obj, setObj] = useState(new thirdParty());
    const [activeIndex, setActiveIndex] = useState(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['39%', '100%'], []);

    const RenderItem = ({item, index}) => {
        return (
            <Image
                source={{uri: item}}
                resizeMode='cover'
                style={style.item_img}
            />
        );
    }

    //get pet data
    useEffect(() => {
        const subscriber = firestore()
        .collection('thirdParty')
        .doc(item_id)
        .onSnapshot(documentSnapshot => {
            var item = new thirdParty();
            item.update(documentSnapshot.data());
            item._id = documentSnapshot.id;

            setObj(item);
            console.log(item)
        })

        return () => subscriber();
    }, [])

    //Main 
    return (
        <View style={style.container}>
            <View style={style.item_img_container}>
                <Carousel
                    layout='default'
                    inactiveSlideOpacity={1}
                    data={obj.img}
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth}
                    renderItem={RenderItem}
                    showsHorizontalScrollIndicator={false}
                    enableSnap={true}
                    onSnapToItem = {index => setActiveIndex(index)}
                />

                <Pagination
                    dotsLength={obj.img.length}
                    activeDotIndex={activeIndex}
                    dotStyle={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        marginHorizontal: 5,
                        backgroundColor: COLORS.white
                    }}
                    inactiveDotStyle={{
                        backgroundColor: '#000000'
                    }}
                    inactiveDotOpacity={0.5}
                    inactiveDotScale={0.7}
                    containerStyle={{marginTop: -95}}
                />

                <View style={style.header}>
                    <BackButton
                        container={'black'}
                        navigation={navigation}
                    />

                    <Text style={style.preview_label}>XEM TRƯỚC</Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.edit_icon_holder}
                        onPress={() => {
                            navigation.navigate('EditProfile', {
                                action: 'edit',
                                paramObj: obj
                            })
                        }}
                    >
                        <Image
                            style={style.edit_icon}
                            source={require('../../assets/icons/ic_edit.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <BottomSheet
                index={0}
                snapPoints={snapPoints}
                enableOverDrag={false}
                style={style.information_container}
            >
                <View style={style.basic_information}>
                    {/* Name, address, phone */}
                    <Text style={style.item_name}>
                        {obj.name}
                    </Text>

                    <View style={style.address_phone_holder}>
                        {/* address */}
                        <View style={style.info_line_holder}>
                            <Image
                                style={style.info_line_icon}
                                source={require('../../assets/icons/ic_maker.png')}    
                            />

                            <Text
                                style={[style.information_detail, {width: '90%'}]}
                                numberOfLines={2}
                            >
                                {obj.address}
                            </Text>
                        </View>

                        {/* phone_number */}
                        <View style={style.info_line_holder}>
                            <Image
                                style={style.info_line_icon}
                                source={require('../../assets/icons/ic_phone.png')}    
                            />

                            <Text
                                style={[style.information_detail, {width: '90%'}]}
                            >
                                {obj.phone_number}
                            </Text>
                        </View>
                    </View>

                    {/* 3 boxes */}
                    <View style={style.boxes_container}>
                        {/* Chat box */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[style.box_holder, {backgroundColor: COLORS.pet_green}]}
                            onPress={() => {}}
                        >
                            <Image
                                style={style.box_icon}
                                source={require('../../assets/icons/ic_chat_grey.png')}
                            />

                            <Text style={style.section_title}>
                                Chat
                            </Text>
                        </TouchableOpacity>

                        {/* Save box */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[style.box_holder, {backgroundColor: COLORS.pet_blue}]}
                            onPress={() => {}}
                        >
                            <Image
                                style={style.box_icon}
                                source={require('../../assets/icons/ic_save_grey.png')}
                            />

                            <Text style={style.section_title}>
                                {strings.save}
                            </Text>
                        </TouchableOpacity>

                        {/* Rating box */}
                        <View
                            style={[style.box_holder, {backgroundColor: COLORS.pet_pink}]}
                        >
                            <Text style={[style.section_title, {fontSize: 24}]}>
                                {obj.rating} ⭐
                            </Text>

                            <Text style={style.section_title}>
                                Đánh giá
                            </Text>
                        </View>
                    </View>

                    <View style={style.tabs_container}>
                        <MyTabs itemId={item_id}/>
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
}

export default ProfileScreen;

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
    },
    btn_container: {
        height: 50,
        width: 50,
        backgroundColor: COLORS.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: 50,
        width: '90%',
        position: 'absolute',
        top: 30,
        marginLeft: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    item_img_container: {
        height: '63%',
    },
    item_img: {
        height: '100%',
    },
    information_container: {
        paddingLeft: 22,
        paddingRight: 22,
    },
    basic_information: {
        flexDirection: 'column',
    },
    item_name: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
    },
    address_phone_holder: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    info_line_holder: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    info_line_icon: {
        width: 28,
        height: 28,
        marginRight: 12,
    },
    boxes_container: {
        width: '100%',
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    box_holder: {
        width: 110,
        height: 110,
        borderRadius: 32,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: COLORS.pet_pink,
    },
    box_icon: {
        width: 44,
        height: 44,
        tintColor: COLORS.dark
    },
    information_detail: {
        color: COLORS.black,
        fontSize: 18,
        fontFamily: 'Roboto-Light',
    },
    section_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
    },
    tabs_container: {
        height: windowHeight / 2 + 90,
        marginTop: 36,
    },
    edit_icon: {
        tintColor: '#fff',
        width: 26,
        height: 26
    },
    edit_icon_holder: {
        height: 48,
        width: 48,
        backgroundColor: COLORS.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    preview_label: {
        color: '#fff',
        fontSize: 18,
        padding: 12,
        opacity: 0.7,
        borderRadius: 10,
        backgroundColor: COLORS.black
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
    }
});