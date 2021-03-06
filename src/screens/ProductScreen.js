import { View, Text, StyleSheet, Image } from "react-native"
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler"
import BottomSheet from "@gorhom/bottom-sheet"

import COLORS from "../theme/colors"
import strings from "../data/strings"
import { moneyFormat } from "../models/common/moneyStringFormat"
import { windowHeight, windowWidth } from "../models/common/Dimensions"
import { getMarketList } from "../api/MarketAPI"
import { getSpeciesList } from "../api/PetAPI"

export function ProductScreen({ navigation }) {
  const [keyword, setKeyword] = useState()

  const SearchBar = () => {
    return (
      <View style={styles.searchBar}>
        <View style={styles.inputBox}>
          <TextInput
            value={keyword}
            onKeyPress={(value) => {
              onSearch(value)
            }}
            style={styles.input}
            placeholder={strings.findInfomation}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          ></TextInput>
        </View>
        <View style={styles.inputBox}>
          <TouchableOpacity>
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("ProductDetail", {
              item_id: props.item._id,
            })
          }}
        >
          <View style={styles.product}>
            <Image
              source={{ uri: props.item.photo }}
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
                  fontFamily: "Roboto-Bold",
                  fontSize: 16,
                }}
              >
                [ {props.item.kind} ] {props.item.name}
              </Text>
              <Text style={{ color: COLORS.green, fontSize: 20 }}>
                {moneyFormat(props.item.price)} VN??
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    marginRight: 20,
                  }}
                >
                  <Text style={styles.medium}>Lo??i</Text>
                  <Text style={styles.medium}>Gi???ng</Text>
                  <Text style={styles.medium}>Tu???i</Text>
                </View>
                <View>
                  <Text style={styles.bold}>{props.item.species}</Text>
                  <Text style={styles.bold}>{props.item.gender}</Text>
                  <Text style={styles.bold}>
                    {"1"} {" th??ng"}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: "#000",
                  fontStyle: "italic",
                  alignSelf: "flex-end",
                }}
              >
                {props.item.province}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const [marketList, setMarketList] = useState([])
  const [marketListQuery, setMarketListQuery] = useState([])
  const [speciesData, setSpeciesData] = useState({})

  const provinces = ["To??n qu???c", "B??nh D????ng", "H?? N???i"]
  const types = ["T???t c???", "Ch??", "M??o", "Chim", "Hamster"]
  const [speciesList, setSpeciesList] = useState()

  const bottomSheetRef = useRef(BottomSheet)
  const snapPoints = useMemo(() => ["0%", "50%"], [])

  const open = () => {
    bottomSheetRef.current.expand()
  }
  const close = () => {
    bottomSheetRef.current.close()
  }

  const [province, setProvince] = useState("To??n qu???c")
  const [kind, setKind] = useState("T???t c???")
  const [species, setSpecies] = useState("T???t c???")

  const [bottomSheetContent, setBottomSheetContent] = useState(provinces)

  useEffect(() => {
    let isCancelled = false
    getMarketList(province, kind, species, (marketList) => {
      setMarketList(marketList)
      setMarketListQuery(marketList)
    })
    return () => {
      isCancelled = true
    }
  }, [kind, province, species])

  const onSearch = (value) => {
    let query = []
    marketList.map((marketItem) => {
      if (
        marketItem.name.includes(value) ||
        marketItem.species.includes(value)
      ) {
        query.push(marketItem)
      }
    })
    setMarketListQuery(query)
  }

  useEffect(() => {
    let isCancelled = false
    getSpeciesList((list) => {
      setSpeciesData(list)
    })
    return () => {
      isCancelled = true
    }
  }, [])

  const getSpecies = (index) => {
    switch (index) {
      case 1:
        setSpeciesList(speciesData.dog)
        break
      case 2:
        setSpeciesList(speciesData.cat)
        break
      case 3:
        setSpeciesList(speciesData.bird)
        break
      case 4:
        setSpeciesList(speciesData.hamster)
        break
      case 0:
      default:
        setSpecies()
        break
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchBar />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SellPet", {
              action: "add",
            })
          }}
        >
          <Image source={require("../assets/icons/Add_white.png")} />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.filterContainer}>
          <View style={[styles.filter, { width: 120 }]}>
            <Text>{province}</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(provinces)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filter, { width: 100 }]}>
            <Text>{kind}</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(types)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filter, { width: 140 }]}>
            <Text>{species}</Text>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetContent(speciesList)
                open()
              }}
            >
              <Image source={require("../assets/icons/Dropdown.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {marketListQuery.map((item) => {
            return <Product key={item._id} item={item} />
          })}
        </ScrollView>
      </View>

      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <ScrollView>
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
                      setKind(types[index])
                      getSpecies(index)
                    }
                    if (bottomSheetContent[0] == provinces[0]) {
                      setProvince(provinces[index])
                    }
                    if (bottomSheetContent[0] == speciesList[0]) {
                      setSpecies(speciesList[index])
                    }
                    close()
                  }}
                >
                  <Text>{p}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
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
    marginRight: 12,
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
    justifyContent: "space-between",
  },
  contentContainer: {
    padding: 10,
    alignItems: "center",
  },
  medium: {
    fontFamily: "Roboto-Meidum",
    fontSize: 14,
    color: "#000",
  },
  bold: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    color: "#000",
  },
})
