import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


import COLORS from '../theme/colors';
import strings from '../data/strings';

export function ScheduleEvent () {

    const [title, setTitle] = useState('Tắm');
    const [date, setDate] = useState('Thứ 4, 6 tháng 10');
    const [time, setTime] = useState('10:00 - 11:00');
    const [jobs, setJobs] = useState([
        "Hello",
        "Hi"
    ])
    const [isEdit, setIsEdit] = useState(false)

    const PetsName = (props) => {
        return (
            <View
                style={styles.petsContainer}
            >
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[0]}
                    </Text>
                </View>
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[1]}
                    </Text>
                </View>
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[2]}
                    </Text>
                </View>
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[3]}
                    </Text>
                </View>
                {
                    props.pets.length >= 5
                    ?
                    <View
                        style={styles.petName}
                    >
                        <Text>
                            {"+" + (props.pets.length - 4)}
                        </Text>
                    </View>
                    : 
                    null
                }
            </View>
        )
    }

    const EventDetails = (props) => {
        return (
            <View
                style={styles.eventJobs}
            >
                <TouchableOpacity>
                    <Image
                        source={require('../assets/icons/Ok.png')}
                    />
                </TouchableOpacity>
                
                <Text>
                    {props.job}
                </Text>

                <Image
                    style={{
                        position: 'absolute',
                        right: 0,
                    }}
                    source={require('../assets/icons/Delete.png')}
                />
            </View>
        )
    }

    return (
        <View
            style={styles.container}
        >
            <View
                style={styles.headerContainer}
            >
                <TouchableOpacity>
                    <Image 
                        style={{
                            margin: 8,
                        }}
                        source={require('../assets/icons/Back.png')}
                    />
                </TouchableOpacity>

                <Text
                    style={styles.title}
                >
                    {title}
                </Text>
            </View>

            <View
                style={styles.bodyContainer}
            >
                <View
                    style={styles.dateTimeContainer}
                >
                    <View>
                        <Text
                            style={styles.detail}
                        >
                            {date}
                        </Text>
                        <Text
                            style={styles.sectionTitle}
                        >
                            {strings.date}
                        </Text>
                    </View>
                    
                    <View>
                        <Text
                            style={styles.detail}
                        >
                            {time}
                        </Text>
                        <Text
                            style={styles.sectionTitle}
                        >
                            {strings.time}
                        </Text>
                    </View>
 
                </View>
            
                <View
                    style={{
                        marginTop: 16,
                        marginBottom: 16,
                    }}
                >
                    <PetsName
                        pets={['Goofy', 'Oggy', 'Jack', 'Perry']}
                    />

                    <Text
                        style={styles.sectionTitle}
                    >
                        {strings.pet}
                    </Text>
                </View>       
            
                <View>
                    <Image
                        source={require('../assets/icons/Shower.png')}
                    />
                    <Text
                        style={styles.sectionTitle}
                    >
                        {strings.type}
                    </Text>
                </View>
            
                <View
                    style={styles.line}
                >

                </View>
            
                <View
                    style={styles.detailsContainer}
                >
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 18,
                        }}
                    >
                        {strings.detail}
                    </Text>

                    {
                        jobs.map(job => {
                            return (
                                <EventDetails
                                    job={job}
                                />
                            )
                        })
                    }
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
        flex: 1.5,
    },
    title: {
        color: COLORS.white,
        fontSize: 28,
        marginLeft: '20%',
    },
    bodyContainer: {
        flex: 8.5,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 36, 
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        color: COLORS.dark,
        fontFamily: 'Roboto-Regular',
        marginTop: 4,
    },
    detail: {
        color: COLORS.dark,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
    },
    petsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
    },
    petName: {
        backgroundColor: COLORS.grey,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 4,
    },
    eventJobs: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    line: {
        backgroundColor: COLORS.dark,
        width: '80%',
        marginTop: 16, 
        marginBottom: 16,
        height: .5,
        alignSelf: 'center'
    },
})



