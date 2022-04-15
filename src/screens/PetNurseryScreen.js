import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { windowHeight, windowWidth } from "../models/common/Dimensions"
import { getNurseryList, getNurseryItem } from "../api/NurseryAPI"

export function PetNurseryScreen({ navigation, route }) {
  const Nurserer = (props) => {
    console.log(props.nurserer.photo)
    return (
      <View style={{ width: "50%" }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("NurseryDetail", {
              item_id: props.nurserer._id,
            })
          }}
        >
          <View style={styles.nurserer}>
            <Image
              source={require("../assets/icons/nursery.png")}
              style={{
                width: (windowWidth - 40) / 2,
                height: (windowWidth - 40) / 2,
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
                  color: COLORS.black,
                }}
              >
                {props.nurserer.name}
              </Text>

              <View style={styles.row}>
                <View>
                  {/* <Text style={styles.regular12}>Kinh nghiệm</Text> */}
                  <Text style={styles.regular12}>Trình độ</Text>
                  <Text style={styles.regular12}>Đánh giá</Text>
                </View>
                <View>
                  {/* <Text style={styles.bold12}>{props.nurserer.experience}</Text> */}
                  <Text style={styles.bold12}>{props.nurserer.level}</Text>
                  <Text style={styles.bold12}>{props.nurserer.rating}</Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "rbga(196, 196, 196, 0.5)",
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: COLORS.black,
                    fontFamily: "Roboto-Italic",
                    fontSize: 12,
                  }}
                >
                  {" "}
                  Được thuê {props.nurserer.hired_time} lần
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    color: COLORS.green,
                  }}
                >
                  {props.nurserer.status}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const [nurseries, setnNurseries] = useState([])

  const levels = ["Tất cả", "Chuyên nghiệp", "Bán chuyên", "Nghiệp dư"]
  const provinces = ["Toàn quốc", "Hà Nội", "Bình Dương", "TP. HCM"]
  const types = ["Tất cả", "Chó", "Mèo"]

  const bottomSheetRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => ["0%", "50%"], [])
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index)
  }, [])

  const open = () => {
    bottomSheetRef.current.expand()
  }

  const close = () => {
    bottomSheetRef.current.close()
  }

  const [province, setProvince] = useState("Toàn quốc")
  const [level, setLevel] = useState("Tất cả")
  const [type, setType] = useState("Tất cả")

  const [bottomSheetContent, setBottomSheetContent] = useState(levels)

  useEffect(() => {
    let isCancelled = false

    getNurseryList(province, type, level, (nurseryList) => {
      setnNurseries(nurseryList)
    })
    return () => {
      isCancelled = true
    }
  }, [province, type, level])

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
        {/* Filter */}
        <View style={styles.filterContainer}>
          <View style={[styles.filter, { width: 120 }]}>
            <Text style={{ color: COLORS.black }}>{province}</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(provinces)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filter, { width: 130 }]}>
            <Text style={{ color: COLORS.black }}>{level}</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(levels)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filter, { width: 70 }]}>
            <Text style={{ color: COLORS.black }}>{type}</Text>
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
        {/* Items */}
        <ScrollView style={{ marginTop: 4 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {nurseries.map((p) => {
              return <Nurserer key={p._id} nurserer={p} />
            })}
          </View>
        </ScrollView>
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
                  if (bottomSheetContent[1] == types[1]) {
                    setType(types[index])
                    close()
                  } else if (bottomSheetContent[1] == provinces[1]) {
                    setProvince(provinces[index])
                    close()
                  } else if (bottomSheetContent[1] == levels[1]) {
                    setLevel(levels[index])
                    close()
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
    padding: 4,
  },
  contentContainer: {
    padding: 10,
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  regular12: {
    color: COLORS.black,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    marginRight: 8,
  },
  bold12: {
    color: COLORS.black,
    fontFamily: "Roboto-Bold",
    fontSize: 12,
  },
})
