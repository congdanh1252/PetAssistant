import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, LogBox, SafeAreaView, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';

import ChatListScreen from './ChatListScreen';
import ServiceItemListTab from './ServiceItemListTab';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { windowWidth, windowHeight } from '../models/common/Dimensions'

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
            name={strings.vaccination_label}
            component={ServiceItemListTab}
            initialParams={{
            //   pet_id: props.petId,
            //   pet_kind: props.petKind
            }}
          />
          <Tab.Screen
            name={strings.treatment_label}
            component={ChatListScreen}
            initialParams={{
            //   pet_id: props.petId
            }}
          />
        </Tab.Navigator>
    );
}

const CategoryItemProfileScreen = ({route, navigation}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['38%', '100%'], []);
    //const { item_id } = route.params;
    const obj = {
        name: "Phòng khám Zoey",
        img: [
            "https://topbrands.vn/wp-content/uploads/2020/11/Phong-kham-thu-y.jpg",
            "https://top247.vn/wp-content/uploads/2020/05/top-10-benh-vien-phong-kham-thu-y-tot-nhat-tai-tphcm-3.jpg",
            "https://nguyentuanhung.vn/wp-content/uploads/2020/02/Phong-kham-thu-y-Animal-Health.jpg",
        ],
        address: "154 Trương Định, Ba Đình, Hà Nội",
        phone_number: "0914.541.022",
    }

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
        // const subscriber = firestore()
        // .collection('users/' + auth().currentUser.uid + '/pets')
        // .doc(pet_id)
        // .onSnapshot(documentSnapshot => {
        //     var newPet = new Pet();
        //     newPet.update(documentSnapshot.data());
        //     newPet.birthday = new Date(documentSnapshot.data().dob.toDate());
        //     newPet._id = documentSnapshot.id;
        //     calculateAge(newPet.birthday);
        //     setPet(newPet);
        // })

        // return () => subscriber();
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
                                source={require('../assets/icons/ic_maker.png')}    
                            />

                            <Text
                                style={[style.information_detail, {width: '90%'}]}
                                numberOfLines={1}
                            >
                                {obj.address}
                            </Text>
                        </View>

                        {/* phone_number */}
                        <View style={style.info_line_holder}>
                            <Image
                                style={style.info_line_icon}
                                source={require('../assets/icons/ic_phone.png')}    
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
                            onPress={() => {
                                navigation.navigate('ChatScreen')
                            }}
                        >
                            <Image
                                style={style.box_icon}
                                source={require('../assets/icons/ic_chat_grey.png')}
                            />

                            <Text style={style.section_title}>
                                Chat
                            </Text>
                        </TouchableOpacity>

                        {/* Save box */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[style.box_holder, {backgroundColor: COLORS.pet_blue}]}
                        >
                            <Image
                                style={style.box_icon}
                                source={require('../assets/icons/ic_save_grey.png')}
                            />

                            <Text style={style.section_title}>
                                {strings.save}
                            </Text>
                        </TouchableOpacity>

                        {/* Weight box */}
                        <View
                            style={[style.box_holder, {backgroundColor: COLORS.pet_pink}]}
                        >
                            <Text style={[style.section_title, {fontSize: 28}]}>
                                4.8
                            </Text>

                            <Text style={style.section_title}>
                                Đánh giá
                            </Text>
                        </View>
                    </View>

                    <View style={style.tabs_container}>
                        <MyTabs/>
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
}

export default CategoryItemProfileScreen;

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
        height: windowHeight / 2 + 32,
        marginTop: 36,
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