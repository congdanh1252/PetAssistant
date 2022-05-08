import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, Dimensions, Image, Text } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { color } from "react-native-elements/dist/helpers"
import {
  PieChart,
  LineChart,
  YAxis,
  Grid,
  XAxis,
} from "react-native-svg-charts"
import { CustomChart } from "./third-party/BarChart"
import { Circle, G, Line, Rect, Text as svgText } from "react-native-svg"
import moment from "moment"
import COLORS from "../theme/colors"
import { moneyFormat } from "../models/common/moneyStringFormat"
import { getMonthStatistic } from "../api/ExpenditureAPI"
import {
  getMonthStatisticTP,
  getMonthStatisticTP2,
  getYearStatisticTP,
} from "../api/third-party/StatisticAPI"

import strings from "../data/strings"
import {
  DoctorIcon,
  FoodIcon,
  StuffIcon,
  HelpIcon,
  StoreIcon,
} from "../assets/icons/index"
import { TouchableOpacity } from "react-native-gesture-handler"
import MonthPicker from "react-native-month-year-picker"
import { Value } from "react-native-reanimated"

export default function StatisticScreen({ route, navigation }) {
  const keys = ["Sức khỏe", "Thức ăn", "Dịch vụ", "Dụng cụ", "Khác"]
  const { type } = route.params
  const types = ["Doctor", "Food", "Service", "Stuff", "Other"]
  const [percentage, setPercentage] = useState([20, 20, 20, 20, 20])
  const [values, setValues] = useState([0, 0, 0, 0, 0])
  const colors = [
    COLORS.yellow,
    COLORS.ocean,
    COLORS.green,
    COLORS.pink,
    COLORS.primaryDark,
  ]
  const [month, setMonth] = useState(new Date())
  const [showData, setShowData] = useState(true)
  const [statisticType, setStatisticType] = useState("year")

  const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    let isCancelled = false
    if (type == "user") {
      getMonthStatistic(month, (values, percentage) => {
        try {
          if (!isCancelled) {
            console.log(values)
            if (
              values[0] == 0 &&
              values[1] == 0 &&
              values[2] == 0 &&
              values[3] == 0 &&
              values[4] == 0
            ) {
              setShowData(false)
            } else {
              setShowData(true)
              setPercentage(percentage)
              setValues(values)
            }
          }
        } catch (error) {
          if (!isCancelled) throw error
        }
      })
      return () => {
        isCancelled = true
      }
    } else {
      if (statisticType == "type") {
        getMonthStatisticTP(month, (values, percentage) => {
          try {
            if (!isCancelled) {
              console.log(values)
              if (
                values[0] == 0 &&
                values[1] == 0 &&
                values[2] == 0 &&
                values[3] == 0 &&
                values[4] == 0
              ) {
                setShowData(false)
              } else {
                setShowData(true)
                setPercentage(percentage)
                setValues(values)
              }
            }
          } catch (error) {
            if (!isCancelled) throw error
          }
        })
      } else if (statisticType == "month") {
        getMonthStatisticTP2(month, (values) => {
          // setData(values)
        })
      } else {
        console.log("Getting year: ..." + month.getFullYear())
        getYearStatisticTP(month, (values) => {
          // setData(values)
          // console.log(values)
        })
      }
      return () => {
        isCancelled = true
      }
    }
  }, [month])

  const Header = () => {
    const [show, setShow] = useState(false)
    const showPicker = useCallback((value) => setShow(value), [])

    const onMonthChange = useCallback(
      (event, newDate) => {
        const selectedDate = newDate || month
        showPicker(false)
        setMonth(selectedDate)
      },
      [month, showPicker]
    )

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{strings.statistic}</Text>
        <TouchableOpacity onPress={() => showPicker(true)}>
          <Text style={styles.headerTitle}>
            {moment(month).format("MMMM - YYYY")}
          </Text>
        </TouchableOpacity>
        {show && (
          <MonthPicker onChange={onMonthChange} value={month} locale="vi" />
        )}
      </View>
    )
  }

  const PieChar = () => {
    const [selectedSliceLabel, setSelectedSliceLabel] = useState("")
    const [selectedSliceValue, setSelectedSliceValue] = useState(0)
    const data = keys.map((key, index) => {
      return {
        key,
        value: percentage[index],
        svg: { fill: colors[index] },
        arc: {
          outerRadius: 70 + percentage[index] + "%",
          padAngle: selectedSliceLabel === key ? 0.1 : 0,
        },
        onPress: () => {
          setSelectedSliceLabel(key)
          setSelectedSliceValue(percentage[index])
        },
      }
    })
    return (
      <View>
        {showData ? (
          <View>
            <Text
              style={{
                fontFamily: "Roboto-Medium",
                textAlign: "center",
                fontSize: 16,
                paddingBottom: 10,
              }}
            >
              {`${selectedSliceLabel} - ${selectedSliceValue}%`}
            </Text>
            <PieChart
              style={{ height: 180, marginBottom: 20 }}
              outerRadius={"80%"}
              innerRadius={"30%"}
              data={data}
            />
          </View>
        ) : (
          <Text style={styles.notFound}>Không có dữ liệu</Text>
        )}
      </View>
    )
  }

  const TypeList = () => {
    return (
      <View>
        {showData && (
          <View style={styles.typeListContainer}>
            {keys.map((value, index) => {
              const color = colors[index]
              var imgSource = HelpIcon
              switch (types[index]) {
                case "Food":
                  imgSource = FoodIcon
                  break
                case "Stuff":
                  imgSource = StuffIcon
                  break
                case "Service":
                  imgSource = StoreIcon
                  break
                case "Doctor":
                  imgSource = DoctorIcon
                  break
                default:
                  imgSource = HelpIcon
                  break
              }
              return (
                <View
                  key={value}
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 8,
                      }}
                      source={imgSource}
                    />
                    <Text style={styles.detail}>{value}</Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.detail}>
                      {moneyFormat(values[index]) + " vnđ"}
                    </Text>

                    <View
                      style={{
                        marginLeft: 16,
                        backgroundColor: color,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                      }}
                    ></View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </View>
    )
  }

  const BottomBar = () => {
    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Image
            style={{
              height: 30,
              width: 30,
            }}
            source={require("../assets/icons/BackArrow.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            style={{
              height: 30,
              width: 30,
            }}
            source={require("../assets/icons/BackArrow.png")}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Body */}
      <View style={styles.bodyContainer}>
        {statisticType == "type" ? (
          <>
            <PieChar />

            <TypeList />
          </>
        ) : (
          <>
            <Text>Doanh thu (nghìn đồng)</Text>
            <CustomChart data={data} />
            <Text style={{ textAlign: "right" }}>
              {statisticType == "month" ? "Tháng" : "Năm"}
            </Text>

            <Picker
              selectedValue={statisticType}
              onValueChange={(itemValue, itemIndex) => {
                setStatisticType(itemValue)
              }}
            >
              <Picker.Item label="Theo thể loại" value="type" />
              <Picker.Item label="Theo tháng" value="month" />
              <Picker.Item label="Theo năm" value="year" />
            </Picker>
          </>
        )}
      </View>

      {/* Footer */}
      <BottomBar />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  headerContainer: {
    flex: 0.8,
    alignItems: "center",
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  notFound: {
    textAlign: "center",
    fontFamily: "Roboto-Italic",
  },
  bodyContainer: {
    padding: 10,
    flex: 9,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  typeListContainer: {
    alignItems: "center",
  },
  detail: {
    fontFamily: "Roboto-Bold",
    fontSize: 12,
  },
  bottomBar: {
    flex: 0.2,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
