import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import BottomSheet from '@gorhom/bottom-sheet';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

const ServiceListScreen = ({route, navigation}) => {
    const [show, setShow] = useState(false);
    const [items, setItems] = useState([
        {
            name: "Phòng khám Zoey",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://www.houstonansweringservices.com/site/wp-content/uploads/2018/08/veterinarian.jpg",
            rating: 4.9
        }, 
        {
            name: "Phòng khám PETCLIN",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://nearme.com.sg/wp-content/uploads/2020/03/best-Serangoon-vet-clinic.jpg",
            rating: 4.7
        },
        {
            name: "Phòng khám Zoey",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://www.houstonansweringservices.com/site/wp-content/uploads/2018/08/veterinarian.jpg",
            rating: 4.9
        }, 
        {
            name: "Phòng khám PETCLIN",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://nearme.com.sg/wp-content/uploads/2020/03/best-Serangoon-vet-clinic.jpg",
            rating: 4.7
        },
        {
            name: "Phòng khám Zoey",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://www.houstonansweringservices.com/site/wp-content/uploads/2018/08/veterinarian.jpg",
            rating: 4.9
        }, 
        {
            name: "Phòng khám PETCLIN",
            address: "134 Thủ Khoa Huân, Thuận An, Bình Dương",
            category: "Phòng khám",
            thumbnail: "https://nearme.com.sg/wp-content/uploads/2020/03/best-Serangoon-vet-clinic.jpg",
            rating: 4.7
        },
    ]);
    const [dataList, setDataList] = useState([]);
    const [filter, setFilter] = useState(0);

    const snapPoints = useMemo(() => ['19%', '19%'], []);

    const getitemListOrderByRating = (filter) => {
        // const subscribe =
        // firestore()
        // .collection('camnang')
        // .orderBy('rating', filter)
        // .get()
        // .then(querySnapshot => {
        //     var itemList = new Array();
        //     querySnapshot.forEach(documentSnapshot => {
        //         var item = new item();
        //         item.update(documentSnapshot.data());
        //         item._id = documentSnapshot.id;
        //         itemList.push(item);
        //     });
        //     setitems(itemList);
        // });
    }

    const filterListBySearch = (input) => {
        
    }

    const ItemList = () => {
        var itemList = [];
        for (let i = 0; i < items.length; i++) {
            itemList.push(
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    style={style.item_holder}
                    onPress={() => {
                        // navigation.navigate('itemDetail', {
                        //     item_id: items[i]._id
                        // })
                    }}
                >
                    <Image
                        style={style.item_thumbnail}
                        source={{uri: items[i].thumbnail}}
                    />

                    <View style={style.item_info_holder}>
                        <Text style={style.item_title}>{items[i].name}</Text>
                        <Text style={style.item_rating_label}>{items[i].address}</Text>
                        <Text style={style.item_rating_label}>Đánh giá: {items[i].rating} ⭐</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        
        return (
            <ScrollView
                style={style.item_list_container}
                showsVerticalScrollIndicator={false}
            >
                {itemList}
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

                <Text style={style.headerTitle}>{items[0].category}</Text>
            </View>

            <View style={style.container}>
                <TextInput
                    style={style.input}
                    placeholder={strings.find}
                    onChangeText={(value) => {
                        filterListBySearch(value)
                    }}
                />

                <View style={style.filter_holder}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            setShow(true)
                        }}
                        style={{width: 70}}
                    >
                        <Text style={style.title}>{strings.sort}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.location_filter_holder}
                    >
                        <Text style={[style.item_rating_label, {opacity: 0.7}]}>Bình Dương</Text>

                        <Image
                            style={style.arrow_down}
                            source={require('../assets/icons/Back_black.png')}
                        />
                    </TouchableOpacity>
                </View>
                
                <ItemList/>
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
                                {/* Hữu ích giảm */}
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
                                        //getitemListOrderByRating('desc');
                                        setShow(false)
                                        setFilter(1)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_desc_sort}
                                    </Text>
                                </TouchableHighlight>

                                {/* Hữu ích tăng */}
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
                                        //getitemListOrderByRating('asc')
                                        setShow(false)
                                        setFilter(2)
                                    }}
                                >
                                    <Text style={style.dropdown_option_text}>
                                        {strings.rating_asc_sort}
                                    </Text>
                                </TouchableHighlight>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
}

export default ServiceListScreen;

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
    filter_holder: {
        width: '100%',
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    location_filter_holder: {
        height: '100%',
        width: 145,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.grey
    },
    arrow_down: {
        transform: [{
            rotateZ: '-90deg',
        }]
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
    },
    item_list_container: {
        height: '100%',
        width: '100%',
        marginTop: 10,
        marginBottom: '22%',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    item_holder: {
        height: 128,
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 4,
        shadowRadius: 10,
        borderTopWidth: 2,
        borderTopColor: COLORS.grey,
        backgroundColor: COLORS.white,
    },
    item_thumbnail: {
        height: 128,
        width: '40%',
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
    },
    item_info_holder: {
        height: '100%',
        width: '60%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    item_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
    },
    item_rating_label: {
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