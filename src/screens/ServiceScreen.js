import React, { useState, useEffect, useMemo } from "react"
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native"

import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import BackButton from "../components/BackButton"

const ServiceScreen = ({ route, navigation }) => {
  const [show, setShow] = useState(false)

  const snapPoints = useMemo(() => ["19%", "19%"], [])

  const Categories = () => {
    return (
        <ScrollView
            style={style.category_holder}
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            {/* Phòng khám */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.category_item}
                onPress={() => {
                    navigation.navigate("ServiceList", {
                    category: "Phòng khám",
                    })
                }}
                >
                <Image
                    style={style.category_icon}
                    source={require("../assets/icons/ic_doctor_fl.png")}
                />

                <Text style={style.item_title}>{strings.clinic_label}</Text>
            </TouchableOpacity>

            {/* Spa chăm sóc */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.category_item}
                onPress={() => {
                    navigation.navigate("ServiceList", {
                    category: "Spa chăm sóc",
                    })
                }}
                >
                <Image
                    style={style.category_icon}
                    source={require("../assets/icons/ic_shampoo.png")}
                />

                <Text style={style.item_title}>{strings.spa_label}</Text>
            </TouchableOpacity>

            {/* Buôn bán */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.category_item}
                onPress={() => {
                    navigation.navigate('ProductStack')
                }}
            >
                <Image
                    style={style.category_icon}
                    source={require('../assets/icons/ic_shopping_fl.png')}
                    />
                
                <Text style={style.item_title}>{strings.market_label}</Text>
            </TouchableOpacity>

            {/* Lưu trữ */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.category_item}
                onPress={() => {
                    navigation.navigate('AppointmentArchive')
                }}
            >
                <Image
                    style={style.category_icon}
                    source={require('../assets/icons/ic_schedules_fl.png')}
                    />
                
                <Text style={style.item_title}>{strings.storage_label}</Text>
            </TouchableOpacity>

            {/* Trông hộ */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.category_item}
                onPress={() => {
                    navigation.navigate('NurseryStack')
                }}
            >
                <Image
                    style={style.category_icon}
                    source={require('../assets/icons/ic_leash.png')}
                    />
                
                <Text style={style.item_title}>{strings.pet_sitter_label}</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

  //Main
  return (
    <View style={style.screen}>
      <View style={style.header}>
        <BackButton container={"trans"} navigation={navigation} />

        <Text style={style.headerTitle}>{strings.service_label}</Text>

        <TouchableOpacity
          style={style.saved_button}
          activeOpacity={0.6}
          onPress={() => {
            //navigation.navigate('SavedList');
            setShow(true)
          }}
        >
          <Image
            style={style.saved_button}
            source={require("../assets/icons/Hamburger.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={style.container}>
        <View style={style.promotion_holder}>
          <Text style={style.title}>{strings.promotion_label}</Text>

          <View style={style.promotion_img_holder}>
            <Image
              style={[style.promotion_img_holder, { marginTop: 0 }]}
              source={{
                uri: "https://img.freepik.com/free-vector/veterinary-banner-template_23-2148980674.jpg",
              }}
            />
          </View>
        </View>

        <View style={style.category_list_holder}>
          <Text style={style.title}>{strings.category_label}</Text>

          <Categories />
        </View>
      </View>

      {/* BottomSheet Filter */}
      {!show ? null : (
        <TouchableWithoutFeedback
          onPress={() => {
            setShow(false)
          }}
        >
          <View style={style.overlay}>
            <BottomSheet
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={{ borderWidth: 1 }}
              style={style.dropdown_bottomsheet}
              enableOverDrag={false}
              enablePanDownToClose={true}
              onClose={() => {
                setShow(false)
              }}
            >
              {/* Dịch vụ đã lưu */}
              <TouchableHighlight
                key={1}
                activeOpacity={0.7}
                underlayColor="#EEEEEE"
                style={style.dropdown_option}
                onPress={() => {
                  setShow(false)
                  navigation.navigate("SavedServiceList")
                }}
              >
                <Text style={style.dropdown_option_text}>
                  {strings.saved_service_label}
                </Text>
              </TouchableHighlight>

              {/* Chat list */}
              <TouchableHighlight
                key={2}
                activeOpacity={0.7}
                underlayColor="#EEEEEE"
                style={style.dropdown_option}
                onPress={() => {
                  setShow(false)
                  navigation.navigate("ChatList")
                }}
              >
                <Text style={style.dropdown_option_text}>
                  {strings.chat_list_label}
                </Text>
              </TouchableHighlight>
            </BottomSheet>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  )
}

export default ServiceScreen

const style = StyleSheet.create({
  screen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  container: {
    height: "100%",
    paddingTop: 22,
    paddingLeft: 22,
    paddingRight: 22,
    paddingBottom: 22,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "column",
    backgroundColor: COLORS.white,
  },
  header: {
    width: "100%",
    height: 110,
    paddingTop: 16,
    paddingLeft: 8,
    flexDirection: "row",
    backgroundColor: COLORS.dark,
  },
  headerTitle: {
    width: "76%",
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 22,
    marginTop: 16,
    color: COLORS.white,
  },
  saved_button: {
    height: 30,
    width: 30,
    marginTop: 8,
  },
  promotion_holder: {
    width: "100%",
    height: "25%",
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
  promotion_img_holder: {
    width: "100%",
    height: "100%",
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: COLORS.green,
  },
  title: {
    color: COLORS.black,
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  category_list_holder: {
    height: "53%",
    width: "100%",
    marginTop: "20%",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  category_holder: {
    height: "89%",
    width: "100%",
    marginTop: 12,
    justifyContent: "space-between",
  },
  category_item: {
    height: 70,
    marginBottom: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 3,
    borderColor: COLORS.grey,
    shadowRadius: 10,
    backgroundColor: COLORS.white,
  },
  item_title: {
    color: COLORS.black,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
  },
  category_icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  dropdown_bottomsheet: {
    borderRadius: 10,
  },
  dropdown_option: {
    width: "99%",
    height: 60,
    padding: 24,
    alignSelf: "center",
    justifyContent: "center",
    borderBottomWidth: 1.5,
    borderColor: COLORS.grey,
  },
  dropdown_option_text: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  overlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
})
