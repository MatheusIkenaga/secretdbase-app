import {StyleSheet } from 'react-native'
import Constants from 'expo-constants'

export default StyleSheet.create({

    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
        backgroundColor: '#2C2F33',
    },

    header: {
        marginTop: 20,
        alignItems: 'center',
    },


    title:{
        fontSize: 25,
        marginBottom: 16,
        marginTop: 48,
        color: '#F6F6F6',
        fontWeight: 'bold',
    },

    button:{
        borderRadius:8
    },

})