import * as React from 'react';
import {useNavigation } from '@react-navigation/native'
import * as Google from 'expo-auth-session/providers/google';
import {View, Image, Button, Text, TextInput, ActivityIndicator } from 'react-native'
import axios from 'axios'
import logoImg from '../../assets/logoLogin.png'
import api from '../../services/api'
import styles from './styles';
import AppLoading from 'expo-app-loading';
import { useFonts ,AnonymousPro_400Regular} from '@expo-google-fonts/anonymous-pro';

export default function Login(){
    const [number, onChangeNumber] = React.useState(null);
    const [number2, onChangeNumber2] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [has2fa, setHas2fa] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    let [fontsLoaded] = useFonts({
        AnonymousPro_400Regular
    });
    
    const navigation = useNavigation()

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '471601995658-jp0lvrr584i86otn6oneh1nc7tl2b6nf.apps.googleusercontent.com',
        scopes: ['profile', 'email']
    });

    React.useEffect(() => {
        if ((token !== null)&&(has2fa !== null)){
            setLoading(false);
            if (has2fa == false){
                navigation.navigate('add2fa', { 'loginToken': token })
            } else {
                navigation.navigate('validate2fa', { 'loginToken': token })
            }
        } else{
            if (response?.type === 'success') {
                const { authentication } = response;
                setLoading(true);
                //Getting user data from Google
                axios
                .get("https://www.googleapis.com/userinfo/v2/me", 
                    { headers: { Authorization: 'Bearer '+authentication.accessToken } })
                .then(response => {
                    var user = {
                        name: response.data.given_name+' '+response.data.family_name,
                        email:response.data.email,
                        googleId: response.data.id,
                        picture: response.data.picture
                    }
    
                    api.post('/api/createUser',user)
                    .then(response => {
                        setToken(response.data.token)
                        setHas2fa(response.data.has2fa)
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
                })
                .catch((error) => {
                    console.log(error),
                    handleMessage('An error ocurred SignIn, try again later')
                    setLoading(false);
                });
     
            }
        }
    }, [response,token,has2fa]);

    
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
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
                        color: '#F6F6F6'}}>Login
                    </Text>
                </View>
                {loading ? (
                    <ActivityIndicator
                    marginTop={30}
                    visible={loading}
                    size={'large'}
                    color={'#F6F6F6'}
                  />
                ) : (
                    <>
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
                        onChangeText={onChangeNumber}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoComplete='email'
                        />

                        <TextInput
                        style={{
                            color: '#F6F6F6',
                            fontFamily: 'AnonymousPro_400Regular',
                            fontSize: 25,
                            marginBottom: 15,
                            marginTop: 5,
                            backgroundColor: '#23272A',
                            borderRadius: 10,
                        }}
                        textAlign={'center'}
                        secureTextEntry={true}
                        placeholderTextColor="#99AAB5"
                        onChangeText={onChangeNumber2}
                        placeholder="Password"
                        keyboardType="default"
                        />

                        <Button
                            color= '#99AAB5'
                            textStyle={{fontFamily:'AnonymousPro_400Regular'}}
                            disabled={!request}
                            title="Login"
                            onPress={() => {
                                promptAsync();
                                }}
                        />
                        
                        <View style={styles.header}>
                            <Text 
                            style={{
                                fontFamily: 'AnonymousPro_400Regular',
                                fontSize: 25,
                                marginBottom: 16,
                                marginTop: 10,
                                color: '#F6F6F6'}}>SignIn
                            </Text>
                        </View>

                        <Button
                        style={{
                            marginTop: 20,
                        }}
                        color= '#99AAB5'
                        textStyle={{fontFamily:'AnonymousPro_400Regular'}}
                        disabled={!request}
                        title="with Google"
                        onPress={() => {
                            promptAsync();
                            }}
                        />
                    </>
                
                )}
            </View>
        )
    }
}