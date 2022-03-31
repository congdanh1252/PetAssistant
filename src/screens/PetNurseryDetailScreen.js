import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useRef, useMemo, useCallback } from "react"
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"

const Star = (props) => {
  var star = []
  for (let i = 0; i < props.num; i++) {
    star.push(<Image key={i} source={require("../assets/icons/Star.png")} />)
  }
  return <View style={styles.rowContainer}>{star}</View>
}

const Rating = () => {
  return (
    <View
      style={{
        backgroundColor: COLORS.grey,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
      }}
    >
      <View style={styles.rowContainer}>
        <Text style={{ fontSize: 14 }}>
          <Text
            style={{
              fontFamily: "Roboto-Bold",
            }}
          >
            Mai Cong Danh
          </Text>
          <Text> đã thuê 2 ngay</Text>
        </Text>
        <Star num={4} />
      </View>
      <Text style={{ textAlign: "justify" }}>
        Bạn có kinh nghiệm nên gửi rất yên tâm, lúc về Tom nhà mình còn quyến
        luyến nữa cơ, sẽ còn ủng hộ bạn!
      </Text>
    </View>
  )
}

export function PetNurseryDetailScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: "Roboto-Medium",
            fontSize: 20,
          }}
        >
          Tìm người trông hộ
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: "Roboto-Regular",
            fontSize: 14,
          }}
        >
          Bình Dương
        </Text>
      </View>

      <View style={styles.bodyContainer}>
        <ScrollView>
          {/* Info */}
          <View>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.line} />
            <View style={styles.rowContainer}>
              <Image
                source={require("../assets/icons/img.png")}
                style={{
                  width: (windowWidth - 40) / 2,
                  borderRadius: 10,
                }}
              />

              <View>
                <View style={styles.rowContainer}>
                  <View style={{ marginRight: 8 }}>
                    <Text>Họ tên</Text>
                    <Text>Tuổi</Text>
                    <Text>Trình độ</Text>
                    <Text>Đánh giá</Text>
                    <Text>Được thuê</Text>
                  </View>
                  <View>
                    <Text style={styles.bold}>TỐNG ĐỨC DŨNG</Text>
                    <Text style={styles.bold}>20</Text>
                    <Text style={styles.bold}>Chuyên nghiệp</Text>
                    <Text style={styles.bold}>4.7</Text>
                    <Text style={styles.bold}>78 lần</Text>
                  </View>
                </View>

                <View style={[styles.rowContainer, { marginTop: 8 }]}>
                  <View>
                    <Text style={{ fontSize: 12, color: COLORS.green }}>
                      Đang sẵn sàng
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.grey,
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: COLORS.black }}>
                      Liên hệ ngay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Experience */}
          <View>
            <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
            <View style={styles.line} />
            <View style={{ padding: 10 }}>
              <Text
                style={{ fontFamily: "Roboto-Regular", textAlign: "justify" }}
              >
                Nhà mình có nuôi cả cho và mèo nên mình có kinh nghiệm chăm sóc
                cả 2 loài. Một số loài mình có nhận trông hộ, mình có thức ăn
                như hạt khô, mình nhận giữ từ vài ngày đến 1 tháng.
              </Text>
              <View
                style={[
                  styles.rowContainer,
                  { width: "60%", alignSelf: "center" },
                ]}
              >
                <View>
                  <Text>Cho</Text>
                  <Text>Meo</Text>
                </View>
                <View>
                  <Text style={styles.bold}>Chiahuahua, Alaska</Text>
                  <Text style={styles.bold}>Anh long ngan, Mun</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rating */}
          <View>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            <View style={styles.line} />
            <View>
              <Rating />
              <Rating />
              <Rating />
              <Rating />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242B2E",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    display: "flex",
    flex: 9,
    flexDirection: "column",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.grey,
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    marginTop: 20,
  },
  bold: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
  },
  line: {
    backgroundColor: COLORS.dark,
    width: "100%",
    marginTop: 2,
    marginBottom: 4,
    height: 0.5,
    alignSelf: "center",
  },
})
