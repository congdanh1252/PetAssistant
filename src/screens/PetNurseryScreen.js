import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useRef, useMemo, useCallback } from "react"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"

export function PetNurseryScreen() {
  const Nurserer = (props) => {
    return (
      <View style={{ width: "50%" }}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.nurserer}>
            <Image
              source={require("../assets/icons/img.png")}
              style={{
                width: (windowWidth - 40) / 2,
                borderRadius: 10,
              }}
            />
            <View
              style={{
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Bold",
                  textAlign: "center",
                }}
              >
                {props.nurserer.name}
              </Text>

              <View
                style={{
                  width: (windowWidth - 58) / 2,
                  display: "flex",
                  flexDirection: "row",
                  padding: 4,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontFamily: "Roboto-Regular",
                      fontSize: 12,
                      marginRight: 4,
                    }}
                  >
                    Kinh nghiệm{"\n"}Đánh giá{"\n"}Trình độ
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      width: (windowWidth - 58) / 2,
                      color: COLORS.black,
                      fontFamily: "Roboto-Medium",
                      fontSize: 12,
                    }}
                  >
                    {props.nurserer.experience}
                    {"\n"}
                    {props.nurserer.rating}
                    {"\n"}
                    {props.nurserer.level}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  width: (windowWidth - 58) / 2,
                  alignSelf: "flex-start",
                  color: COLORS.black,
                  fontFamily: "Roboto-Italic",
                  fontSize: 12,
                }}
              >
                {" "}
                Được thuê {props.nurserer.hired} lần
              </Text>

              <View
                style={{
                  backgroundColor: "rbga(196, 196, 196, 0.5)",
                  borderRadius: 10,
                  padding: 4,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.green,
                  }}
                >
                  Đang sẵn sàng
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const nurserer = [
    {
      name: "Tong Duc Dung",
      experience: "Chó, mèo",
      rating: 4.7,
      level: "Chuyen nghiep",
      hired: 78,
      status: "Dang san sang",
    },
    {
      name: "Tong Duc Dung",
      experience: "Chó, mèo",
      rating: 4.7,
      level: "Chuyen nghiep",
      hired: 78,
      status: "Dang san sang",
    },
    {
      name: "Tong Duc Dung",
      experience: "Chó, mèo",
      rating: 4.7,
      level: "Chuyen nghiep",
      hired: 78,
      status: "Dang san sang",
    },
  ]

  const provinces = ["Toàn quốc", "Bình Dương", "Hà Nội"]
  const types = ["Chó", "Mèo"]

  const bottomSheetRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => ["0%", "50%"], [])
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index)
  }, [])

  const open = () => {
    bottomSheetRef.current.expand()
  }

  const [province, setProvince] = useState()
  const [bottomSheetContent, setBottomSheetContent] = useState(provinces)

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
        <View style={styles.filterContainer}>
          <View style={[styles.filter, { width: 180 }]}>
            <Text>Trình độ</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(provinces)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filter, { width: 120 }]}>
            <Text>Chó</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(types)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.filter}>
            <TouchableOpacity>
              <Image source={require("../assets/icons/Filter.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {nurserer.map((p) => {
            return <Nurserer nurserer={p} />
          })}
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          {bottomSheetContent.map((p, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 10,
                }}
                onPress={(event) => {
                  if (bottomSheetContent[0] == types[0]) {
                    console.log(types[index])
                  }
                  if (bottomSheetContent[0] == provinces[0]) {
                    console.log(provinces[index])
                  }
                }}
              >
                <Text>{p}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </BottomSheet>
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
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: windowWidth - windowWidth / 4,
    height: 40,
    color: "#000",
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputBox: {
    alignItems: "center",
  },
  bodyContainer: {
    display: "flex",
    flex: 9,
    flexDirection: "column",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 8,
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
  nurserer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    margin: 5,
  },
  contentContainer: {
    padding: 10,
    alignItems: "center",
  },
})
