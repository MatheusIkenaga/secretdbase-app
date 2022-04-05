import React from 'react'
import {useNavigation} from '@react-navigation/native'
import {View, Image, Text, TouchableOpacity, Button, TextInput} from 'react-native'
import logoImg from '../../assets/logo.png'
import styles from './styles'
import api from '../../services/api'

export default function Validate2fa({route}){
    const loginToken = route.params.loginToken
    const navigation = useNavigation()
    const [token, setToken] = React.useState(null);
    const [token2fa, setToken2fa] = React.useState(null);

    const headers = { headers: { 'Authorization': `Bearer ${token}` } }


    async function validate2fa(){
        if (token){
            await api.post('/api/verify2fa',{'token':token2fa},headers)
            .then((response) => {
                if(response.data.success !== true){
                    alert('Error, try again')
                } else {
                    navigation.navigate('getPassword', { 'loginToken': token, 'skipped': false})
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.status);
                if (error.response.status==401){
                    navigation.navigate('login')
                }
            });
        }
    }

    function skip2fa(){
        navigation.navigate('getPassword', { 'loginToken': token, 'skipped': true})
    }

    React.useEffect(() => {
        setToken(loginToken)
        if(token2fa){
            if (token2fa.length == 6){
                validate2fa()
            }
        }
    },[token2fa]);
    
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
                marginBottom: 30,
                marginTop: 30,
                textAlign: 'center',
                color: '#F6F6F6'}}>Validate Code
            </Text>
            
            <TextInput
            style={{
                color: '#F6F6F6',
                fontFamily: 'AnonymousPro_400Regular',
                fontSize: 25,
                marginBottom: 35,
                marginTop: 5,
                backgroundColor: '#23272A',
                borderRadius: 10,
            }}
            textAlign={'center'}
            placeholderTextColor="#99AAB5"
            maxLength={6}
            onChangeText={value => {
                setToken2fa(value)
            }}
            placeholder="Type your Auth Code"
            keyboardType="numeric"
            />


            <Button
                marginTop={20}
                color= '#99AAB5'
                textStyle={{fontFamily:'AnonymousPro_400Regular'}}
                title="Or click Here to Skip (you wont be able to see your passwords)"
                onPress={() => {
                    skip2fa();
                }}
            />
            
        </View>
    )
}