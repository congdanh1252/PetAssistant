import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useRef, useMemo, useCallback } from "react"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"

export function ProductScreen() {
  const SearchBar = () => {
    const [keyword, setKeyword] = useState()

    return (
      <View style={styles.searchBar}>
        <View style={styles.inputBox}>
          <TextInput
            value={keyword}
            onChangeText={(value) => {
              setKeyword(value)
            }}
            style={styles.input}
            placeholder={strings.findInfomation}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          ></TextInput>
        </View>
        <View style={styles.inputBox}>
          <TouchableOpacity onPress={() => {}}>
            {/* <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require("../assets/icons/Search.png")}
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const Product = (props) => {
    return (
      <View style={{ width: "100%" }}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.product}>
            <Image
              source={require("../assets/icons/img.png")}
              style={{
                width: (windowWidth - 58) / 2,
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
                  width: (windowWidth - 58) / 2,
                  fontFamily: "Roboto-Bold",
                }}
              >
                {props.product.title}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.medium}>Giá</Text>
                  <Text style={styles.medium}>Loài</Text>
                  <Text style={styles.medium}>Giống</Text>
                  <Text style={styles.medium}>Tuổi</Text>
                </View>
                <View>
                  <Text style={{ color: COLORS.green }}>10000000</Text>
                  <Text style={styles.bold}>{props.product.kind}</Text>
                  <Text style={styles.bold}>{props.product.gender}</Text>
                  <Text style={styles.bold}>
                    {props.product.age} {" tháng"}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  alignSelf: "flex-end",
                  color: COLORS.black,
                  fontFamily: "Roboto-Regular",
                  fontSize: 14,
                }}
              >
                {props.product.place}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const products = [
    {
      title: "Cho' Husky",
      price: 400000,
      gender: "Đực",
      kind: "Husky",
      age: 2,
      place: "Ho Chi Minh",
    },
    {
      title: "Cho' Husky",
      price: 400000,
      gender: "Đực",
      kind: "Husky",
      age: 2,
      place: "Ho Chi Minh",
    },
    {
      title: "Cho' Husky",
      price: 400000,
      gender: "Đực",
      kind: "Husky",
      age: 2,
      place: "Ho Chi Minh",
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
        <SearchBar />
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.filterContainer}>
          <View style={[styles.filter, { width: 180 }]}>
            <Image source={require("../assets/icons/Map.png")} />
            <Text>Toàn quốc</Text>
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
            <Image source={require("../assets/icons/Map.png")} />
            <Text>Thuốc</Text>
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
        {products.map((p) => {
          return <Product product={p} />
        })}
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
    flexDirection: "row",
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
  product: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: COLORS.grey,
    borderRadius: 10,
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    alignItems: "center",
  },
  medium: {
    fontFamily: "Roboto-Meidum",
    fontSize: 14,
  },
  bold: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
  },
})
