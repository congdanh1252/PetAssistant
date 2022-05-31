import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Linking } from "react-native"
import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"
import { moneyFormat } from "../models/common/moneyStringFormat"
import MarketItem from "../models/MarketItem"
import { getMarketItem } from "../api/MarketAPI"
import { getUserInfo } from "../api/UserAPI"
import User from "../models/user"

export function ProductDetailScreen({ route, navigation }) {
  const bottomSheetRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => ["60%", "90%"], [])
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index)
  }, [])
  const [item, setItem] = useState(new MarketItem())
  const [seller, setSeller] = useState(new User())
  const [activeIndex, setActiveIndex] = useState(0)
  const [photos, setPhotos] = useState([])

  const RenderItem = ({item, index}) => {
    return (
        <Image
            source={{uri: item}}
            resizeMode='cover'
            style={styles.item_img}
        />
    );
  }

  useEffect(() => {
    const { item_id } = route.params
    let isCancelled = false
    getMarketItem(item_id, (item) => {
      if (item != "error") {
        let img = item.photos;
        img.push(item.photo)
        setItem(item)
        setPhotos(img)

        let temp = new User()
        temp._id = item.seller_id
        setSeller(temp)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    if (seller._id != "") {
      getUserInfo(seller._id, (user) => {
        console.log(seller)
        setSeller(user)
      })
    }
    return () => {
      isCancelled = true
    }
  }, [seller._id])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.row60, { height: 50 }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Image source={require("../assets/icons/Back.png")} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Roboto-Bold",
            fontSize: 24,
            color: COLORS.white,
          }}
        >
          {item.name}
        </Text>
        <TouchableOpacity></TouchableOpacity>
      </View>

      {/* <Image
        source={{ uri: item.photo }}
        style={{
          width: 200,
          borderRadius: 10,
        }}
      /> */}

      <View style={styles.item_img_container}>
        <Carousel
          layout='default'
          inactiveSlideOpacity={1}
          data={item.photos}
          sliderWidth={windowWidth}
          itemWidth={windowWidth}
          renderItem={RenderItem}
          showsHorizontalScrollIndicator={false}
          enableSnap={true}
          onSnapToItem = {index => setActiveIndex(index)}
        />

        <Pagination
          dotsLength={item.photos.length}
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
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enableOverDrag={false}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.sectionContainer}>
              <Text style={styles.headerText}>{item.name}</Text>
              <Text style={styles.normalText}>{item.species}</Text>
              <Text style={styles.priceText}>
                {moneyFormat(item.price)} VNĐ
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin</Text>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Loài</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.kind}</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Giống</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.species}</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Giới tính</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.gender}</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Chiều cao</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.height} cm</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Cân nặng</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.weight} kg</Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 8,
                }}
              >
                <Text style={styles.petInfo}>{item.description}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

              {/* Address */}
              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Địa chỉ</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{item.province}</Text>
                </View>
              </View>

              {/* Phone */}
              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Số điện thoại</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>{seller.phoneNumber}</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.row60}>
                <TouchableOpacity style={{ alignItems: "center" }}>
                  <Image source={require("../assets/icons/Report.png")} />
                  <Text style={styles.normalText}>Báo cáo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: COLORS.grey,
                      width: 75,
                      height: 75,
                      borderRadius: 37.5,
                    }}
                  >
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={require("../assets/icons/dog.png")}
                    />
                  </View>

                  <Text style={styles.normalText}>{seller.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center" }}>
                  <Image source={require("../assets/icons/Save_black.png")} />
                  <Text style={styles.normalText}>Lưu tin</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Lưu ý</Text>

              <View style={styles.row60}>
                <View>
                  <Text style={styles.petInfo}>
                    Khuyến khích bạn nên gặp và trao đổi trực tiếp để tránh
                    trường hợp gặp phải lừa đảo
                  </Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View>
                  <Text style={styles.petInfo}>
                    Khuyến khích bạn nên gặp và trao đổi trực tiếp để tránh
                    trường hợp gặp phải lừa đảo
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={{ height: 20 }}></View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ width: "50%" }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${seller.phoneNumber}`)
            }}
            style={[
              {
                backgroundColor: COLORS.pet_green,
              },
              styles.button,
            ]}
          >
            <Text style={{color: '#000'}}>Gọi điện</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: "50%" }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: COLORS.pet_pink,
              },
              styles.button,
            ]}
            onPress={() => {
              navigation.navigate('ChatScreen', {
                obj_id: item.seller_id,
                obj_name: seller.name,
                obj_avt: 'https://topbestviet.com/media/base/person.png',
              })
            }}
          >
            <Text style={{color: '#000'}}>Nhắn tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  item_img_container: {
    height: '32%',
  },
  item_img: {
    height: '100%',
  },
  headerText: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: COLORS.black,
  },
  normalText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: COLORS.black,
  },
  priceText: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    color: COLORS.green,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: COLORS.black,
  },
  bodyContainer: {
    display: "flex",
    flex: 6,
    flexDirection: "column",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 8,
  },
  contentContainer: {
    backgroundColor: COLORS.grey,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 8,
  },
  petInfo: {
    fontFamily: "Roboto-Regular",
    padding: 4,
    fontSize: 16,
    color: "#000",
  },
  row60: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  button: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
})
