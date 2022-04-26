import React, { useEffect, useCallback, useMemo, useRef, useState } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import BottomSheet, { BottomSheetFooter } from "@gorhom/bottom-sheet"
import { Agenda, Calendar, CalendarList } from "react-native-calendars"
import { LocaleConfig } from "react-native-calendars"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import CalendarStrip from "react-native-calendar-strip"
import moment from "moment"

import COLORS from "../../theme/colors"

export default function ScheduleScreen() {
  const bottomSheetRef = useRef < BottomSheet > null
  // variables
  const snapPoints = useMemo(() => ["50%", "80%"], [])
  const [state, setState] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reminderList, setReminderList] = useState([])
  const [oldReminderList, setOldReminderList] = useState([])
  const [dates, setDates] = useState([])
  const [monthData, setMonthData] = useState(JSON)

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Image source={require("../../assets/icons/BackArrow.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddScheduleScreen")
            }}
          >
            <Image source={require("../../assets/icons/Add.png")} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../assets/icons/Settings.png")} />
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    []
  )

  const handleSheetChanges = useCallback((index) => {
    setState(index)
  }, [])

  return (
    <View style={styles.container}>
      {state == 0 ? (
        <CalendarList
          onVisibleMonthsChange={(months) => {
            setSelectedDate(new Date(months[0].dateString))
          }}
          horizontal={true}
          pagingEnabled={true}
          markedDates={monthData}
          theme={{
            calendarBackground: COLORS.dark,
            textSectionTitleColor: "#E5E5E5",
            selectedDayBackgroundColor: "#E21717",
            selectedDayTextColor: "#E5E5E5",
            dotColor: "#ff0000",
            todayTextColor: "#ff0000",
            dayTextColor: "#E5E5E5",
            monthTextColor: "#E5E5E5",
          }}
          onDayPress={(date) => {
            setSelectedDate(new Date(date.dateString))
          }}
        />
      ) : (
        <CalendarStrip
          style={{ height: 150, paddingTop: 20 }}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            highlightColor: COLORS.white,
          }}
          calendarColor={COLORS.dark}
          calendarHeaderStyle={{ color: COLORS.white }}
          dateNumberStyle={{ color: COLORS.white }}
          highlightDateNumberStyle={{ color: COLORS.dark }}
          dateNameStyle={{ color: COLORS.white, fontSize: 12 }}
          highlightDateNameStyle={{ color: COLORS.dark }}
          iconContainer={{ flex: 0.1 }}
          calendarAnimation={{
            type: "sequence",
            duration: 100,
          }}
          onDateSelected={(date) => {
            setSelectedDate(new Date(date))
          }}
          selectedDate={selectedDate}
        />
      )}

      <BottomSheet
        useRef={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        footerComponent={renderFooter}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
            }}
          >
            Ngày {moment(selectedDate).format("DD MMMM")}
          </Text>
          <ScrollView>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 20,
              }}
            >
              Sắp tới
            </Text>
            {reminderList.length <= 0 ? (
              <Text
                style={{
                  marginTop: 4,
                  fontFamily: "Roboto-Italic",
                  fontSize: 14,
                  marginLeft: 30,
                }}
              >
                Không có dữ liệu
              </Text>
            ) : null}

            {reminderList.map((reminder) => {
              return <CalendarEvent key={reminder._id} reminder={reminder} />
            })}

            <Text
              style={{
                marginTop: 20,
                fontSize: 18,
                marginLeft: 20,
              }}
            >
              Đã qua
            </Text>
            {oldReminderList.length <= 0 ? (
              <Text
                style={{
                  marginTop: 4,
                  fontFamily: "Roboto-Italic",
                  fontSize: 14,
                  marginLeft: 30,
                }}
              >
                Không có dữ liệu
              </Text>
            ) : null}

            {oldReminderList.map((reminder) => {
              return <CalendarEvent key={reminder._id} reminder={reminder} />
            })}
          </ScrollView>
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
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  eventContainer: {
    position: "relative",
    width: "90%",
    alignSelf: "center",
    height: 100,
    borderRadius: 15,
    padding: 12,
    marginTop: 12,
  },
  yellowBackground: {
    backgroundColor: COLORS.yellow,
  },
  greenBackground: {
    backgroundColor: COLORS.green,
  },
  pinkBackground: {
    backgroundColor: COLORS.pink,
  },
  eventTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  petsContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    marginTop: 16,
    bottom: 12,
    left: 12,
  },
  petName: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 4,
  },
  eventTime: {
    position: "absolute",
    bottom: 12,
    right: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  navBar: {
    position: "absolute",
    bottom: 0,
  },
  footerContainer: {
    width: "60%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
})
