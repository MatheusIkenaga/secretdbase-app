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

    passwordList:{
        marginTop: 10,
        fontFamily: 'AnonymousPro_400Regular',
    },

    incident:{
        padding:24,
        borderRadius:8,
        backgroundColor: '#97A9B4',
        marginBottom: 16,
        fontFamily: 'AnonymousPro_400Regular',
    },

    incidentProperty:{
        fontSize: 16,
        color: '#41414d',
        fontFamily: 'AnonymousPro_700Bold',
    },

    incidentValue:{
        marginTop: 5,
        fontSize: 16,
        fontFamily: 'AnonymousPro_400Regular',
        textAlign:'right',
        color: '#23272A'
    },

    detailsButton:{
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'AnonymousPro_400Regular',
    },

    detailsButtonText:{
        color: '#FFFFFF',
        fontSize: 15,
        alignSelf: 'flex-end',
        fontFamily: 'AnonymousPro_700Bold'
    }

})