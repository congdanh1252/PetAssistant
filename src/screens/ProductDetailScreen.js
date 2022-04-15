import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import React, { useState, useRef, useMemo, useCallback } from "react"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"

export function ProductDetailScreen() {
  const bottomSheetRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => ["60%", "90%"], [])
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index)
  }, [])

  return (
    <View style={styles.container}>
      <View style={[styles.row60, { height: 50 }]}>
        <TouchableOpacity>
          <Image source={require("../assets/icons/Back.png")} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Roboto-Bold",
            fontSize: 24,
            color: COLORS.white,
          }}
        >
          Mèo
        </Text>
        <TouchableOpacity>
          <Image source={require("../assets/icons/Back.png")} />
        </TouchableOpacity>
      </View>

      <Image source={require("../assets/icons/Photos.png")} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          <View>
            <View style={styles.sectionContainer}>
              <Text style={styles.headerText}>Mèo gì không viết tên</Text>
              <Text style={styles.normalText}>Chiahuahua - Thuần chủng</Text>
              <Text style={styles.priceText}>2.000.000 VNĐ</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Thông tin</Text>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Giống</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Chihuahua</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Giống</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Chihuahua</Text>
                </View>
              </View>

              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Giống</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Chihuahua</Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 8,
                }}
              >
                <Text style={styles.petInfo}>
                  Bé đã được tiêm đầy đủ các liều vaccine cơ bản, sức khỏe hiện
                  tại vẫn đang rất tốt, vì điều kiện gia đình không cho phép nên
                  chủ không thể tiếp tục nuôi, chỉ bán cho những người chỉ thực
                  sự yêu quý động vật. Ai có nhu cầu vui lòng liên hệ trực tiếp
                  qua ứng dụng hoặc qua số điện thoại được hiển thị ở trên, xin
                  cảm ơn
                </Text>
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
                  <Text style={styles.petInfo}>
                    132 Trương Định, Hoàng Mai, Hà Nội
                  </Text>
                </View>
              </View>

              {/* Phone */}
              <View style={styles.row60}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>Số điện thoại</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.petInfo}>+84 932 69 63 61</Text>
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

                  <Text style={styles.normalText}>dungtd</Text>
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
            style={[
              {
                backgroundColor: COLORS.pet_green,
              },
              styles.button,
            ]}
          >
            <Text>Gọi điện</Text>
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
          >
            <Text>Nhắn tin</Text>
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
  headerText: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
  },
  normalText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  priceText: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    color: COLORS.green,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
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
