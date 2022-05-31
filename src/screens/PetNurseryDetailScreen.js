import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"
import { getNurseryItem, getRatingList } from "../api/NurseryAPI"
import Nursery from "../models/nursery"

const Star = (props) => {
  var star = []
  for (let i = 0; i < props.num; i++) {
    star.push(<Image key={i} source={require("../assets/icons/Star.png")} />)
  }
  return <View style={styles.rowContainer}>{star}</View>
}

const Rating = (props) => {
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
              color: COLORS.black,
            }}
          >
            {props.rating.user}
          </Text>
          <Text> đã thuê {props.rating.period} ngày</Text>
        </Text>
        <Star num={props.rating.rating} />
      </View>
      <Text style={{ textAlign: "justify", color: COLORS.black }}>
        {props.rating.detail}
      </Text>
    </View>
  )
}

export function PetNurseryDetailScreen({ navigation, route }) {
  const [item, setItem] = useState(new Nursery())
  const [ratingList, setRatingList] = useState([])

  useEffect(() => {
    const { item_id } = route.params
    let isCancelled = false
    getNurseryItem(item_id, (item) => {
      if (item != "error") {
        setItem(item)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    const { item_id } = route.params
    let isCancelled = false
    getRatingList(item_id, (ratingList) => {
      if (item != "error") {
        console.log(ratingList)
        setRatingList(ratingList)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [item._id])

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
      </View>

      <View style={styles.bodyContainer}>
        <ScrollView>
          {/* Info */}
          <View>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.line} />
            <View style={styles.rowContainer}>
              <Image
                source={require("../assets/icons/nursery.png")}
                style={{
                  width: (windowWidth - 40) / 2,
                  height: (windowWidth - 40) / 2,
                  borderRadius: 10,
                }}
              />

              <View>
                <View style={styles.rowContainer}>
                  <View style={{ marginRight: 8 }}>
                    <Text style={{ color: COLORS.black }}>Họ tên</Text>
                    <Text style={{ color: COLORS.black }}>Tuổi</Text>
                    <Text style={{ color: COLORS.black }}>Trình độ</Text>
                    <Text style={{ color: COLORS.black }}>Đánh giá</Text>
                    <Text style={{ color: COLORS.black }}>Được thuê</Text>
                  </View>
                  <View>
                    <Text style={styles.bold}>{item.name.toUpperCase()}</Text>
                    <Text style={styles.bold}>{item.age}</Text>
                    <Text style={styles.bold}>{item.level}</Text>
                    <Text style={styles.bold}>{item.rating}</Text>
                    <Text style={styles.bold}>{item.hired_time} lần</Text>
                  </View>
                </View>

                <View style={[styles.rowContainer, { marginTop: 8 }]}>
                  <View>
                    <Text style={{ fontSize: 12, color: COLORS.green }}>
                      {item.status}
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
                style={{
                  fontFamily: "Roboto-Regular",
                  textAlign: "justify",
                  color: COLORS.black,
                }}
              >
                {item.experience}
              </Text>
              {/* <View
                style={[
                  styles.rowContainer,
                  { width: "60%", alignSelf: "center" },
                ]}
              >
                <View>
                  <Text style={{ color: COLORS.black }}>Chó</Text>
                  <Text style={{ color: COLORS.black }}>Mèo</Text>
                </View>
                <View>
                  <Text style={styles.bold}>Chiahuahua, Alaska</Text>
                  <Text style={styles.bold}>Anh long ngan, Mun</Text>
                </View>
              </View> */}
            </View>
          </View>

          {/* Rating */}
          <View>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            <View style={styles.line} />
            <View>
              {ratingList.map((rating) => {
                return <Rating key={rating._id} rating={rating} />
              })}
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
    color: COLORS.black,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    marginTop: 20,
    color: COLORS.black,
  },
  bold: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    color: COLORS.black,
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
