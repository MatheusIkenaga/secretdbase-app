import React from 'react'
import {useNavigation} from '@react-navigation/native'
import {View, Image, Text, TouchableOpacity, Alert, TextInput} from 'react-native'
import * as Clipboard from 'expo-clipboard';
import logoImg from '../../assets/logo.png'
import styles from './styles'
import api from '../../services/api'

export default function Add2fa({route}){
    const loginToken = route.params.loginToken
    const navigation = useNavigation()
    const defaulQrCode = 'https://miro.medium.com/max/400/1*GEqPOVVy64VfRXvL4RBKcw.png'
    const [token, setToken] = React.useState(null);
    const [qrCode, setQrCode] = React.useState(defaulQrCode);
    const [code2fa, setCode2fa] = React.useState(null);
    const [token2fa, setToken2fa] = React.useState(null);

    const headers = { headers: { 'Authorization': `Bearer ${token}` } }

    const copyToClipboard = () =>
        Alert.alert('Copy QR Code', 'To Clipboard?', [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        { text: 'OK', onPress: () => Clipboard.setString(code2fa) },
    ]);

    async function getQrCode(){
        await api.get('/api/add2fa',headers)
        .then((response) => {
            console.log(response)
            setQrCode(response.data.qr)
            setCode2fa(response.data.key)
        })
        .catch(error => {
            console.log(error);
            console.log(error.response.status);
        });
    }

    async function validate2fa(){
        await api.post('/api/verify2fa',{'token':token2fa},headers)
        .then((response) => {
            if(response.data.success !== true){
                alert('Error, try again')
            } else {
                navigation.navigate('getPassword', { 'loginToken': token , 'skipped': false, 'refresh': true})
            }
        })
        .catch(error => {
            console.log(error);
            console.log(error.response.status);
        });
    }

    React.useEffect(() => {
        setToken(loginToken)
        if (qrCode == defaulQrCode){
            getQrCode()
        }
        if(token2fa){
            if (token2fa.length == 6){
                validate2fa()
            }
        }
    },[token,token2fa]);
    
    return(

        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text 
                    style={{
                        fontFamily: 'AnonymousPro_400Regular',
                        fontSize: 25,
                        marginBottom: 16,
                        marginTop: 20,
                        marginHorizontal: 20,
                        color: '#F6F6F6'}}>2 Factor Authentication
                    </Text>
            </View>
            <Text 
            style={{
                fontFamily: 'AnonymousPro_400Regular',
                fontSize: 25,
                marginBottom: 10,
                marginTop: 30,
                textAlign: 'center',
                color: '#F6F6F6'}}>QR CODE
            </Text>
            <Image
            style={{
                resizeMode: "contain",
                width: '90%',
                height: '40%',
                alignSelf: 'center'
            }}
            source={{uri:qrCode}}
            />
            
            <TouchableOpacity 
            style={{
                alignItems: "center",
                justifyContent: "center"
            }}
            onPress={copyToClipboard}>
                <Text 
                style={{
                    fontFamily: 'AnonymousPro_400Regular',
                    fontSize: 20,
                    marginBottom: 15,
                    marginTop: 20,
                    textAlign: 'center',
                    color: '#F6F6F6'}}>or tap here to copy the code to Clipboard
                </Text>

            </TouchableOpacity>
            
            <TextInput
            style={{
                color: '#F6F6F6',
                fontFamily: 'AnonymousPro_400Regular',
                fontSize: 25,
                marginBottom: 5,
                marginTop: 5,
                backgroundColor: '#23272A',
                borderRadius: 10,
            }}
            textAlign={'center'}
            placeholderTextColor="#99AAB5"
            maxLength={6}
            onChangeText={value => {
                setToken2fa(value)
                console.log(token2fa)
            }}
            placeholder="Type your Auth Code"
            keyboardType="numeric"
            />
        </View>
    )
}