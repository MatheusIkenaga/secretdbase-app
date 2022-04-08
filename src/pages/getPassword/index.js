import React from 'react'
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import {View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import AppLoading from 'expo-app-loading';
import api from '../../services/api'
import { SearchBar, Button } from 'react-native-elements';
import { useFonts ,AnonymousPro_700Bold} from '@expo-google-fonts/anonymous-pro';

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function GetPassword({route}){
    const loginToken = route.params.loginToken
    const loginSkipped = route.params.skipped
    const loginRefresh = route.params.refresh
    const navigation = useNavigation()
    const [token, setToken] = React.useState(null);
    const [skipped, setSkipped] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);
    const [passwordRawArray, setPasswordRawArray] = React.useState(null);
    const [passwordReqArray, setPasswordReqArray] = React.useState(null);
    const [disableRefresh, setDisableRefresh] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    function addNewPassword(){
        var newPass = {"id":0,"app":"","login":"","password":""}
        navigation.navigate('upsertPassword', { 'loginToken': token, 'skipped': skipped, 'row': newPass })
    }
    function editPassword(row){
        navigation.navigate('upsertPassword', { 'loginToken': token, 'skipped': skipped, 'row': row })
    }

    const headers = { headers: { 'Authorization': `Bearer ${token}` } }

    let [fontsLoaded] = useFonts({
        AnonymousPro_700Bold,

      });

    async function getPasswords(){
        if (token){
            await api.get('/api/getapps',headers)
            .then((response) => {
                console.log(response)
                console.log(JSON.stringify(response.data))
                setPasswordRawArray(response.data)
                setPasswordReqArray(response.data)
                setDisableRefresh(false)
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.status);
                if (error.response.status==401){
                    navigation.navigate('login')
                }
                setDisableRefresh(false)
            });
        }
    }

    const searchFilterFunction = (text) => {
        if (text) {
          const newData = passwordRawArray.filter(function (item) {
            const itemData = item.app
              ? item.app.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setPasswordRawArray(newData);
          setSearchText(text);
        } else {
          setPasswordRawArray(passwordReqArray);
          setSearchText(text);
        }
    };

    React.useEffect(() => {
        setToken(loginToken)
        setSkipped(loginSkipped)
        setRefresh(loginRefresh)
        
        if ((passwordRawArray == null)||(refresh == true)){
            if(refresh){
                navigation.setParams({ 'loginToken': token, 'skipped': skipped, 'refresh': !refresh})
                setRefresh(false)
            }
            getPasswords()
        }
        
    },[token,passwordRawArray,refresh,route]);
    
    
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
                        marginHorizontal: 20,
                        color: '#F6F6F6'}}>List of Passwords
                    </Text>

                </View>
                <View style={styles.search}>
                    <SearchBar
                        style={{
                            fontFamily: 'AnonymousPro_400Regular',
                            fontSize: 20,
                        }}
                        round
                        containerStyle={{
                            backgroundColor: 'transparent',
                            borderBottomColor: 'transparent',
                            borderTopColor: 'transparent',
                            width: '90%'}}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => searchFilterFunction(text)}
                        onClear={(text) => searchFilterFunction('')}
                        placeholder="Search Here..."
                        value={searchText}
                    />
                    <Feather 
                        name={"refresh-cw"} 
                        size={20} 
                        color={"#FFFFFF"} 
                        disabled={disableRefresh}
                        onPress={() => {
                            getPasswords()
                            setDisableRefresh(true)}}
                    />
                </View>

                <Button
                    buttonStyle={{borderColor:'#99AAB5',}}
                    color= '#99AAB5'
                    width={'90%'}
                    type={'outline'}
                    titleStyle={{fontFamily:'AnonymousPro_400Regular',
                    fontSize: 18,
                    color:'#99AAB5',}}
                    title="New Password"
                    onPress={() => {
                        addNewPassword();
                    }}
                />


                <FlatList 
                    data={passwordRawArray}
                    style={styles.passwordList}
                    keyExtractor={password => String(password.id)}
                    showsVerticalScrollIndicator={false}

                    renderItem={({item: password})=>(
                        <View style={styles.incident}>
                            <View style={styles.detailsButton}>
                                <Text style={styles.incidentProperty}>App:</Text>
                                <Text style={styles.incidentValue}>{password.app}</Text>
                            </View>

                            <View style={styles.detailsButton}>
                                <Text style={styles.incidentProperty}>User:</Text>
                                {skipped ? ( <Text style={styles.incidentValue}>*****</Text>) :
                                <Text style={styles.incidentValue}>{password.login}</Text>}
                            </View>

                            <View style={styles.detailsButton}>
                                <Text style={styles.incidentProperty}>Password:</Text>
                                {skipped ? ( <Text style={styles.incidentValue}>*****</Text>) :
                                <Text style={styles.incidentValue}>{password.password}</Text>}
                            </View>

                        <TouchableOpacity 
                            style={styles.detailsButton}
                            onPress={() => editPassword(password)}
                        >
                            
                            <Text style={styles.detailsButtonText}>Edit Password</Text>
                            <Feather name={"arrow-right"} size={16} color={"#FFFFFF"} />

                        </TouchableOpacity>

                    </View>

                    )}
                />

            </View>
        )
    }
}