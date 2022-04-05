import React from 'react'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import {View, Alert, Image, Text, TextInput} from 'react-native'
import AppLoading from 'expo-app-loading';
import api from '../../services/api'
import * as Clipboard from 'expo-clipboard';
import { useFonts ,AnonymousPro_700Bold} from '@expo-google-fonts/anonymous-pro';

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function UpsertPassword({route}){
    const loginToken = route.params.loginToken
    const loginSkipped = route.params.skipped
    const loginRow = route.params.row
    const navigation = useNavigation()

    const [token, setToken] = React.useState(null);
    const [skipped, setSkipped] = React.useState(true);
    const [row, setRow] = React.useState(null);
    const [app, setApp] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    
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


    let [fontsLoaded] = useFonts({
        AnonymousPro_700Bold,
    });

    function setNewOrEdit(){
        if (loginRow){
            setRow(loginRow)
        } else{
            var obj = {
                app: 'Insert App Name',
                login: 'Insert Username',
                password: 'Insert Password',
            }
            setRow(obj)
        }
    }

    async function updatePassword(obj){
        if(token){
            const body = {
                id: obj.id,
                app: obj.app,
                login: obj.login,
                password: obj.password
            }
            await api.post('/api/updateapp',body,headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableRefresh(false)
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

    async function savePassword(obj){
        if(token){
            const body = {
                app: obj.app,
                login: obj.login,
                password: obj.password
            }
            await api.post('/api/addapp',body,headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableRefresh(false)
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

    async function restorePassword(id){
        if(token){
            await api.post('/api/restoreapp',{'id': id},headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableRefresh(false)
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

    async function deletePassword(id){
        if(token){
            await api.post('/api/deleteapp',{'id': id},headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableRefresh(false)
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

    React.useEffect(() => {
        setToken(loginToken)
        setSkipped(loginSkipped)
        setNewOrEdit()
    },[token,row]);
    
    
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={logoImg} />
                    {loginRow ? (
                        <Text 
                        style={{
                            fontFamily: 'AnonymousPro_400Regular',
                            fontSize: 25,
                            marginBottom: 16,
                            marginTop: 20,
                            marginHorizontal: 20,
                            marginRight: 40,
                            color: '#F6F6F6'}}>Edit Password
                        </Text>
                    ):(
                        <Text 
                        style={{
                            fontFamily: 'AnonymousPro_400Regular',
                            fontSize: 25,
                            marginBottom: 16,
                            marginTop: 20,
                            marginHorizontal: 20,
                            marginRight: 50,
                            color: '#F6F6F6'}}>New Password
                        </Text> 
                    )}
                </View>

                <View style={styles.incident}>
                    <View style={styles.detailsButton}>
                        <Text style={styles.incidentProperty}>App:</Text>
                        {skipped ? ( <Text style={styles.incidentValue}>{row.app}</Text>) :
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
                            setApp(value)
                        }}
                        placeholder={row.app}
                        />}
                        
                    </View>

                    <View style={styles.detailsButton}>
                        <View style={styles.viewValue}>
                        <Text style={styles.incidentProperty}>User:</Text>
                        <Feather name={"copy"} size={20} color={"#23272A"} />
                        </View>
                            {skipped ? ( <Text style={styles.incidentValue}>***</Text>) :
                            <TextInput
                            style={{
                                color: '#F6F6F6',
                                fontFamily: 'AnonymousPro_400Regular',
                                fontSize: 20,
                                marginBottom: 35,
                                marginTop: 5,
                                backgroundColor: '#23272A',
                                borderRadius: 10,
                            }}
                            textAlign={'center'}
                            placeholderTextColor="#99AAB5"
                            maxLength={6}
                            onChangeText={value => {
                                setUser(value)
                            }}
                            placeholder={row.login}
                            />}
                            
                    </View>

                    <View style={styles.detailsButton}>
                        <View style={styles.viewValue}>
                            <Text style={styles.incidentProperty}>Password:</Text>
                            <Feather name={"copy"} size={20} color={"#23272A"} />
                        </View>
                            {skipped ? ( <Text style={styles.incidentValue}>*****</Text>) :
                            <TextInput
                            style={{
                                color: '#F6F6F6',
                                fontFamily: 'AnonymousPro_400Regular',
                                fontSize: 20,
                                marginBottom: 35,
                                marginTop: 5,
                                backgroundColor: '#23272A',
                                borderRadius: 10,
                            }}
                            textAlign={'center'}
                            placeholderTextColor="#99AAB5"
                            maxLength={6}
                            onChangeText={value => {
                                setPassword(value)
                            }}
                            placeholder={row.password}
                            />}
                            
                    </View>

                    {row.deleteDate ? ( <Text style={styles.incidentValue}>
                        This register is going to be deleted 48h after {row.deleteDate}
                        </Text>) 
                        :
                        <></>
                    }

                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'AnonymousPro_400Regular',
                    marginTop:50,
                    padding:24,
                }} >
                    <Feather name={"trash-2"} size={40} color={"#FFFFFF"} />
                    <Feather name={"save"} size={40} color={"#FFFFFF"} />
                </View>

            </View>
        )
    }
}