import { View } from "react-native"
import React from "react"
import { Text } from "react-native-svg"
import {
  PieChart,
  LineChart,
  BarChart,
  YAxis,
  Grid,
  XAxis,
} from "react-native-svg-charts"

export const CustomChart = (props) => {
  const data = props.data

  const axesSvg = { fontSize: 14, fill: "grey", fontFamily: "Roboto-Regular" }
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30

  const CUT_OFF = 20

  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((value, index) => (
      <Text
        key={index}
        x={x(index) + 2}
        y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
        fontSize={12}
        fill={value >= CUT_OFF ? "white" : "black"}
        alignmentBaseline={"middle"}
        svgTextAnchor={"middle"}
      >
        {value + "k"}
      </Text>
    ))

  return (
    <View
      style={{
        flexDirection: "row",
        height: 400,
        paddingTop: 16,
      }}
    >
      <YAxis
        data={data}
        style={{ marginBottom: xAxisHeight }}
        contentInset={verticalContentInset}
        svg={axesSvg}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <BarChart
          style={{ flex: 1 }}
          data={data}
          svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
          contentInset={verticalContentInset}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
          <Labels />
        </BarChart>
        <XAxis
          style={{
            height: xAxisHeight,
            marginTop: 10,
          }}
          data={data}
          formatLabel={(value, index) => index + 1}
          contentInset={{ left: 10, right: 10 }}
          svg={axesSvg}
        />
      </View>
    </View>
  )
}
