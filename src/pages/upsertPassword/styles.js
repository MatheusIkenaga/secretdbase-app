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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'AnonymousPro_400Regular',
    },

    search: {
        alignItems: 'flex-start',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'AnonymousPro_400Regular',
    },

    headerText:{
        fontSize: 15,
        color: '#737380',
        fontFamily: 'AnonymousPro_400Regular',
    },

    headerTextBold:{
        fontWeight: 'bold',
        fontFamily: 'AnonymousPro_400Regular',
    },

    title:{
        fontSize: 30,
        marginBottom: 16,
        marginTop: 48,
        color: '#13131a',
        fontWeight: 'bold',
        fontFamily: 'AnonymousPro_400Regular',
    },

    description:{
        fontSize: 16,
        lineHeight: 26,
        color: '#737380',
        fontFamily: 'AnonymousPro_400Regular',
    },

    incident:{
        marginTop: 30,
        padding:24,
        borderRadius:8,
        borderColor: '#99AAB5', 
        borderWidth: 1,
        //backgroundColor: '#97A9B4',
        marginBottom: 16,
        fontFamily: 'AnonymousPro_400Regular',
        height: 400
    },

    incidentProperty:{
        fontSize: 20,
        color: '#99AAB5',
        fontFamily: 'AnonymousPro_700Bold',
    },

    incidentValue:{
        marginTop: 10,
        marginBottom:30,
        fontSize: 20,
        fontFamily: 'AnonymousPro_400Regular',
        color: '#99AAB5',
        textAlign: 'center'
    },

    deletedPass:{
        marginBottom:20,
        fontSize: 20,
        fontFamily: 'AnonymousPro_400Regular',
        color: '#99AAB5',
        textAlign: 'center'
    },

    del:{
       flex: 1
    },

    detailsButton:{
        marginTop:25,
        justifyContent: 'space-between',
        fontFamily: 'AnonymousPro_400Regular',
    },

    viewValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },



})