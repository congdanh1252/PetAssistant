import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import COLORS from '../theme/colors'

const VaccinationScreen = () => {
    //const [vaccine, setVaccine] = useState();

    const VaccineList = () => {
        var list = [];
        for (let i = 0; i < 3; i++) {
            list.push(
                <View
                    key={i}
                    style={
                        i != 0
                        ? 
                        style.vaccine_item : [style.vaccine_item, {height: 180}]
                    }
                >
                    {/* Mục lục + Mũi tên */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={style.item_title_holder}
                        onPress={() => {
                            
                        }}
                    >
                        <Text style={style.title}>💉 20/12/2021 - Bệnh Dại</Text>

                        <Image
                            style={
                                true
                                ?
                                style.arrow_down : style.arrow_horiz
                            }
                            source={require('../assets/icons/Back_black.png')}
                        />
                    </TouchableOpacity>

                    {/* Mục lục chi tiết */}
                    {
                        i == 0
                        ?
                        <View style={style.vaccine_detail_holder}>
                            <Text style={style.label}>Mũi tiêm: Bệnh Dại</Text>

                            <View style={style.item_title_holder}>
                                <Text style={style.label}>Nhãn vắc-xin:</Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        style={{width: 75, height: 70, borderRadius: 6}}
                                        source={{uri: 'https://bizweb.dktcdn.net/100/381/237/products/vacxin-5-benh.jpg?v=1596780695787'}}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                >
                                    <Image source={require('../assets/icons/Pen.png')}/>
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={style.label}>Ngày tái chủng: 20/01/2022</Text>
                        </View>
                        : null
                    }
                </View>
            )
        }

        return (
            <View>
                {list}
            </View>
        )
    }

    return (
        <View style={style.container}>
            <ScrollView
                style={style.vaccination_list_container}
                showsVerticalScrollIndicator={false}
            >
                <VaccineList/>
            </ScrollView>

            <View style={style.taken_list_container}>
                <View style={style.two_vaccine_row}>
                    <Text style={style.label}>1. Mũi 1 - 5 bệnh  ✔️</Text>
                    <Text style={style.label}>2. Mũi 2 - 7 bệnh  ✔️</Text>
                </View>

                <View style={style.two_vaccine_row}>
                    <Text style={style.label}>3. Mũi 3 - 7 bệnh  ❌</Text>
                    <Text style={style.label}>4. Mũi 4 - Bệnh Dại  ✔️</Text>
                </View>
            </View>

            <TouchableOpacity
                style={style.floating_button}
                activeOpacity={0.7}
                onPress={() => {

                }}
            >
                <Image
                    source={require('../assets/icons/Add.png')}
                    style={style.add_btn}
                />
            </TouchableOpacity>
        </View>
    );
}

export default VaccinationScreen;

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
        padding: 22,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    vaccination_list_container: {
        width: '100%',
        height: '40%',
        marginBottom: 24,
        backgroundColor: COLORS.white
    },
    taken_list_container: {
        width: '100%',
        height: 100,
        marginBottom: 16,
        borderRadius: 22,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: COLORS.black,
        backgroundColor: COLORS.white
    },
    two_vaccine_row: {
        padding: 14,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vaccine_item: {
        width: '100%',
        height: 50,
        fontSize: 16,
        padding: 12,
        elevation: 4,
        shadowRadius: 10,
        borderRadius: 12,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    item_title_holder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: COLORS.black
    },
    label: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
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
    vaccine_detail_holder: {
        height: 128,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    floating_button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    add_btn: {
        width: 56,
    }
});