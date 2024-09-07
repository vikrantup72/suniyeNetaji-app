import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocialActivityes from "../Component/socialactivityes/SocialActivityes";
import Commentscreen from "../Component/commentlist/Commentscreen";
import Profile from "../Container/ProfileScreen";
import EditProfileScreen from "../Container/ProfileScreen/EditProfileScreen";
import AuthStack from "./AuthStack";
import BottomTabStack from "./BottomTabStack";
import Notification from "../Component/Notification";
import likeList from "../Component/socialactivityes/likeList";
import Menu from "../Container/Menu";
import Home from "../Container/HomeScreen/Home";
import Registration from "../Container/AuthScreen/RegisterScreen";
import ReuseScreen from "../Component/Notification/FindFriendsScreen";
import PostScreen from "../Container/PostScreen";
import { useSelector } from "react-redux";
import VotedScreen from "../Container/SearchScreen/VotedScreen";
import Support from "../Container/Menu/Support";
import OffersScreen from "../Component/Notification/OffersScreen";
import FollowersScreen from "../Container/ProfileScreen/FollowersScreen";
import FollowingScreen from "../Container/ProfileScreen/FollowingScreen";
import AddExperience from "../Component/AddExperience";
import ReelComponent from "../Component/ReelComponent";
import Draft from "../Component/Draft";
import FindFriendsScreen from "../Component/Notification/FindFriendsScreen";
import UserProfile from "../Container/ProfileScreen/UserProfile";
import UserActivity from "../Component/Notification/UserActivity";
import CreateGroup from "../Container/MassageScreen/CreateGroup";
import ChatScreen from "../Container/MassageScreen/ChatScreen";
import TotalNotification from "../Component/Notification/TotalNotification";
import GroupInfo from "../Container/MassageScreen/GroupInfo";
import KycVarifyScreen from "../Container/Menu/KycVarifyScreen";
import GetKycScreen from "../Container/Menu/GetKycScreen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const { isToken } = useSelector((state) => state.profile);
  console.log(isToken, "authKeygg");
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isToken ? (
          <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        <Stack.Screen name="PostScreen" component={PostScreen} />
        {/* <Stack.Screen name="MassageScreen" component={MassageScreen} /> */}
        <Stack.Screen name="SocialActivityes" component={SocialActivityes} />
        <Stack.Screen name="Commentscreen" component={Commentscreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="likeList" component={likeList} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="ReuseScreen" component={ReuseScreen} />
        <Stack.Screen name="VotedScreen" component={VotedScreen} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="OffersScreen" component={OffersScreen} />
        <Stack.Screen name="FollowersScreen" component={FollowersScreen} />
        <Stack.Screen name="FollowingScreen" component={FollowingScreen} />
        <Stack.Screen name="AddExperience" component={AddExperience} />
        <Stack.Screen name="Reel" component={ReelComponent} />
        <Stack.Screen name="Draft" component={Draft} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="FindFriendsScreen" component={FindFriendsScreen} />
        <Stack.Screen name="UserActivity" component={UserActivity} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="TotalNotification" component={TotalNotification} />
        <Stack.Screen name="GroupInfo" component={GroupInfo} />
        <Stack.Screen name="KycVarifyScreen" component={KycVarifyScreen} />
        <Stack.Screen name="GetKycScreen" component={GetKycScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({});
