import React from 'react'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import {View, Alert, Image, Text, TextInput} from 'react-native'
import AppLoading from 'expo-app-loading';
import api from '../../services/api'
import * as Clipboard from 'expo-clipboard';
import { useFonts ,AnonymousPro_700Bold} from '@expo-google-fonts/anonymous-pro';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

import logoImg from '../../assets/logo.png'

import styles from './styles'

var appValue = null
var userValue = null
var passValue = null

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
    const [totalDuration, setTotalDuration] = React.useState(0);
    const [disableDelete, setDisableDelete] = React.useState(false);
    const [disableRestore, setDisableRestore] = React.useState(false);
    const [disableSave, setDisableSave] = React.useState(false);
    const [disableCopy, setDisableCopy] = React.useState(false);
    
    const headers = { headers: { 'Authorization': `Bearer ${token}` } }
    
    function copyToClipboard(source,value){
        Alert.alert('Copy '+source, 'to Clipboard?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => Clipboard.setString(value) },
        ])
        setDisableCopy(false)
    }

    let [fontsLoaded] = useFonts({
        AnonymousPro_700Bold,
    });

    function refreshRow(){
        var obj = {
            app: app,
            login: user,
            password: password
        }
        setRow(obj)
    }

    async function updatePassword(obj){
        if(token){
            const body = {
                id: obj.id,
                app: appValue,
                login: userValue,
                password: passValue
            }
            await api.post('/api/updateapp',body,headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableSave(false)
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
                app: appValue,
                login: userValue,
                password: passValue
            }
            await api.post('/api/addapp',body,headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setDisableSave(false)
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
                setDisableRestore(false)
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
                setDisableDelete(false)
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.status);
                if (error.response.status==401){
                    navigation.navigate('login')
                }
            });
        }

        Alert.alert('Going to be deleted', 'in 48 hours', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
    }

    React.useEffect(() => {
        setToken(loginToken)
        setSkipped(loginSkipped)
        setRow(loginRow)
        if (loginRow.id !== 0){

            appValue    = loginRow.app
            userValue   = loginRow.login
            passValue   = loginRow.password
            var date = moment().format()
            var expirydate = moment(loginRow.deleteDate).add(48,'h').format()
            var diffr = moment.duration(moment(expirydate).diff(moment(date)));
            var hours = parseInt(diffr.asHours());
            var minutes = parseInt(diffr.minutes());
            var seconds = parseInt(diffr.seconds());
            var d = hours * 60 * 60 + minutes * 60 + seconds;
            setTotalDuration(d);
        }
            
    },[token,row]);
    
    
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return(
            <View style={styles.container}>
                <View style={styles.del}>

                    <View style={styles.header}>
                        <Image source={logoImg} />
                        {row.id !== 0 ? 
                        (
                            <Text 
                            style={{
                                fontFamily: 'AnonymousPro_400Regular',
                                fontSize: 25,
                                marginBottom: 16,
                                marginTop: 20,
                                marginHorizontal: 20,
                                marginRight: 40,
                                color: '#99AAB5'}}>Edit Password
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
                                color: '#99AAB5'}}>New Password
                            </Text> 
                        )}
                    </View>

                    <View style={styles.incident}>
                        <View style={styles.detailsButton}>
                            <Text style={styles.incidentProperty}>App:</Text>
                            {row.id == 0 ? (
                                //New Register of Password
                                <TextInput
                                    style={{
                                        color: '#99AAB5',
                                        fontFamily: 'AnonymousPro_400Regular',
                                        fontSize: 25,
                                        marginBottom: 35,
                                        marginTop: 5,
                                        backgroundColor: '#23272A',
                                        borderRadius: 10,
                                    }}
                                    textAlign={'center'}
                                    placeholderTextColor="#99AAB5"
                                    onChangeText={(valueApp) => {
                                        appValue = valueApp
                                        setApp(valueApp)
                                        setUser(row.login)
                                        setPassword(row.password)
                                    }}
                                    placeholder={'Insert App'}
                                />
                            ): 
                             skipped ?  (
                            //2FA Skipped
                            <Text 
                                style={styles.incidentValue}>
                                    {row.app}
                            </Text> ):
                            //2FA Authenticated
                            <TextInput
                                style={{
                                    color: '#99AAB5',
                                    fontFamily: 'AnonymousPro_400Regular',
                                    fontSize: 25,
                                    marginBottom: 35,
                                    marginTop: 5,
                                    backgroundColor: '#23272A',
                                    borderRadius: 10,
                                }}
                                textAlign={'center'}
                                defaultValue={row.app}
                                placeholderTextColor="#99AAB5"
                                onChangeText={(valueApp) => {
                                    appValue = valueApp
                                    setApp(valueApp)
                                    setUser(row.login)
                                    setPassword(row.password)
                                }}
                                placeholder={row.app}
                            />}
                            
                        </View>

                        <View style={styles.detailsButton}>
                            <View style={styles.viewValue}>
                            <Text style={styles.incidentProperty}>User:</Text>
                            {skipped ? ( <></>):
                                <Feather 
                                    name={"copy"} 
                                    size={20} 
                                    color={"#99AAB5"} 
                                    onPress={() => {
                                        copyToClipboard('username',row.login)
                                        setDisableCopy(true)
                                    }}
                                />}
                            </View>
                                {row.id == 0 ? (
                                //New Register of Password
                                <TextInput
                                    style={{
                                        color: '#99AAB5',
                                        fontFamily: 'AnonymousPro_400Regular',
                                        fontSize: 25,
                                        marginBottom: 35,
                                        marginTop: 5,
                                        backgroundColor: '#23272A',
                                        borderRadius: 10,
                                    }}
                                    textAlign={'center'}
                                    placeholderTextColor="#99AAB5"
                                    onChangeText={(valueUser) => {
                                        userValue = valueUser
                                        setApp(row.app)
                                        setUser(valueUser)
                                        setPassword(row.password)
                                    }}
                                    placeholder={'Insert username'}
                                />
                            ): skipped ? ( <Text style={styles.incidentValue}>*****</Text>) :
                                <TextInput
                                style={{
                                    color: '#99AAB5',
                                    fontFamily: 'AnonymousPro_400Regular',
                                    fontSize: 20,
                                    marginBottom: 35,
                                    marginTop: 5,
                                    backgroundColor: '#23272A',
                                    borderRadius: 10,
                                }}
                                textAlign={'center'}
                                placeholderTextColor="#99AAB5"
                                defaultValue={row.login}
                                onChangeText={(valueUser) => {
                                    userValue = valueUser
                                    setApp(row.app)
                                    setUser(valueUser)
                                    setPassword(row.password)
                                }}
                                placeholder={row.login}
                                />}
                                
                        </View>

                        <View style={styles.detailsButton}>
                            <View style={styles.viewValue}>
                                <Text style={styles.incidentProperty}>Password:</Text>
                                {skipped ? ( <></>):
                                <Feather 
                                    name={"copy"} 
                                    size={20} 
                                    color={"#99AAB5"} 
                                    onPress={() => {
                                        copyToClipboard('password',row.password)
                                        setDisableCopy(true)
                                    }}
                                />}
                            </View>
                                {row.id == 0 ? (
                                //New Register of Password
                                <TextInput
                                    style={{
                                        color: '#99AAB5',
                                        fontFamily: 'AnonymousPro_400Regular',
                                        fontSize: 25,
                                        marginBottom: 35,
                                        marginTop: 5,
                                        backgroundColor: '#23272A',
                                        borderRadius: 10,
                                    }}
                                    textAlign={'center'}
                                    placeholderTextColor="#99AAB5"
                                    onChangeText={(valuePass) => {
                                        passValue = valuePass
                                        setApp(row.app)
                                        setUser(row.login)
                                        setPassword(valuePass)
                                    }}
                                    placeholder={'Insert password'}
                                />
                            ): skipped ? ( <Text style={styles.incidentValue}>*****</Text>) :
                                <TextInput
                                style={{
                                    color: '#99AAB5',
                                    fontFamily: 'AnonymousPro_400Regular',
                                    fontSize: 20,
                                    marginBottom: 35,
                                    marginTop: 5,
                                    backgroundColor: '#23272A',
                                    borderRadius: 10,
                                }}
                                textAlign={'center'}
                                placeholderTextColor="#99AAB5"
                                defaultValue={row.password}
                                onChangeText={(valuePass) => {
                                    passValue = valuePass
                                    setApp(row.app)
                                    setUser(row.login)
                                    setPassword(valuePass)
                                }}
                                placeholder={row.password}
                                />}
                                
                        </View>
                        

                    </View>

                    {row.deleteDate ? ( 
                            <View>
                                <Text style={styles.deletedPass}>
                                This password is going to be deleted in
                                </Text>
                                <CountDown
                                    until={totalDuration}
                                    digitStyle={{backgroundColor: '#99AAB5'}}
                                    timetoShow={('H', 'M', 'S')}
                                    digitTxtStyle={{color: '#2C2F33'}}
                                    timeLabelStyle={{color: '#99AAB5', fontWeight: 'bold'}}
                                    onFinish={() => navigation.goBack() }
                                    size={20}
                                />
                            </View>)
                            :
                            skipped ? ( <Text style={{marginTop: 30,
                                marginBottom:30,
                                fontSize: 20,
                                fontFamily: 'AnonymousPro_400Regular',
                                color: '#99AAB5',
                                textAlign: 'center'}}>You need to authenticate to check your passwords</Text>) : <></>
                        }
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'AnonymousPro_400Regular',
                        marginTop:10,
                        marginBottom: 30
                    }} >
                        <Feather 
                            name={"trash-2"} 
                            size={40} 
                            color={"#99AAB5"} 
                            disabled={disableDelete}
                            onPress={() => {
                                deletePassword(row.id)
                                setDisableDelete(true)
                                navigation.navigate('getPassword', { 'loginToken': token, 'skipped': skipped, 'refresh': true})
                            }}
                        />
                        {row.deleteDate ? (<Feather 
                                                name={"corner-up-left"} 
                                                size={40} 
                                                color={"#99AAB5"} 
                                                disabled={disableRestore}
                                                onPress={() => {
                                                    restorePassword(row.id)
                                                    setDisableRestore(true)
                                                    navigation.navigate('getPassword', { 'loginToken': token, 'skipped': skipped, 'refresh': true})
                                                }}
                                            />) 
                            :
                            <Feather 
                                name={"save"} 
                                size={40} 
                                color={"#99AAB5"} 
                                disabled={skipped}
                                onPress={() => {
                                    if (row.id){
                                        updatePassword(row)
                                    } else{
                                        refreshRow()
                                        savePassword(row)
                                    }
                                    setDisableSave(true)
                                    navigation.navigate('getPassword', { 'loginToken': token, 'skipped': skipped, 'refresh': true})
                                }}
                            />
                        }
                    </View>
                

            </View>
        )
    }
}