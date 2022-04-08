import React from 'react'
import{ NavigationContainer } from '@react-navigation/native'
import{ createStackNavigator } from '@react-navigation/stack'

const AppStack = createStackNavigator()

import login from './pages/login' 
import add2fa from './pages/add2fa'
import getPassword from './pages/getPassword'
import upsertPassword from './pages/upsertPassword'
import validate2fa from './pages/validate2fa'

export default function Routes(){
    return(
        <NavigationContainer>

            <AppStack.Navigator screenOptions={{headerShown: false}}>
                <AppStack.Screen name="login" component={login}/>
                <AppStack.Screen name="add2fa" component={add2fa}/>
                <AppStack.Screen name="getPassword" component={getPassword}/>
                <AppStack.Screen name="upsertPassword" component={upsertPassword}/>
                <AppStack.Screen name="validate2fa" component={validate2fa}/>
            </AppStack.Navigator>

        </NavigationContainer>
    )
}