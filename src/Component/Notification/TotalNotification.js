// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { colors } from "../../utils";
// import { RfH, RfW } from "../../utils/helper";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllNotification } from "../../redux/NotificationReducer";
// import { notificationStatusUpdate } from "../../redux/SocialReducer";
// import { useAndroidBackHandler } from "react-navigation-backhandler";
// import { useNavigation } from "@react-navigation/native";

// const TotalNotification = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const [buttonText, setButtonText] = useState("mark read");
//   const [loading, setLoading] = useState(true);
//   const TotalNotifications = useSelector((state) => state.notification.data);

//   useEffect(() => {
//     const loadNotifications = async () => {
//       try {
//         setLoading(true);
//         await dispatch(fetchAllNotification());
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadNotifications();
//   }, [dispatch]);

//   useAndroidBackHandler(() => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//       return true;
//     }
//     return false; // Let the system handle the back button event
//   });

//   const renderSeparator = () => {
//     return <View style={styles.separator} />;
//   };

//   const renderNoRepliesMessage = () => {
//     return (
//       <View style={styles.loaderContainer}>
//         <Text>No notifications available.</Text>
//       </View>
//     );
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];

//     const day = date.getDate();
//     const month = months[date.getMonth()];
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${hours}:${formattedMinutes}`;
//   };

//   const handleNotificationStatusUpdate = async () => {
//     try {
//       await dispatch(notificationStatusUpdate()).unwrap();
//       setButtonText("marked");
//     } catch (err) {
//       console.error("Failed to update notification status:", err);
//     }
//   };

//   const renderListHeader = () => {
//     return (
//       <TouchableOpacity
//         onPress={handleNotificationStatusUpdate}
//         activeOpacity={0.8}
//         style={styles.headerContainer}
//       >
//         <Text style={styles.headerText}>{buttonText}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View
//         style={{
//           flexDirection: "row",
//           paddingHorizontal: 10,
//           paddingTop: RfH(15),
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.leftItem}
//         >
//           <AntDesign name="left" size={20} color={colors.black} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.title}>Notification</Text>
//         </View>
//       </View>
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="small" color={colors.skyblue} />
//         </View>
//       ) : (
//         <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
//           <FlatList
//             data={TotalNotifications}
//             keyExtractor={(item) => item.id.toString()}
//             ListEmptyComponent={renderNoRepliesMessage}
//             ListHeaderComponent={renderListHeader}
//             renderItem={({ item }) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate("Commentscreen", {
//                       postId: item?.post?.id,
//                       item: item?.comment?.id,
//                     })
//                   }
//                   style={styles.flatlistcontainer}
//                 >
//                   <View style={styles.rowContainer}>
//                     <View style={{ flexDirection: "row" }}>
//                       <View style={styles.imgcontainer}>
//                         {item?.sender?.picture ? (
//                           <Image
//                             source={{
//                               uri: `https://stage.suniyenetajee.com${item?.sender?.picture}`,
//                             }}
//                             style={styles.profilepicsty}
//                           />
//                         ) : (
//                           <Image
//                             source={require("../../assets/images/dummyplaceholder.png")}
//                             style={styles.profilepicsty}
//                           />
//                         )}
//                       </View>
//                       <View style={styles.msgcontainer}>
//                         <View style={styles.nameContainer}>
//                           <Text style={styles.namesty}>
//                             {item?.sender?.name?.length > 16
//                               ? `${item?.sender?.name.slice(0, 16)}...`
//                               : item?.sender?.name}
//                           </Text>
//                         </View>
//                         {item?.notification_type === "post_like" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               liked your post
//                             </Text>
//                           </View>
//                         )}
//                         {item?.notification_type === "post_comment" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               commented on your post
//                             </Text>
//                           </View>
//                         )}

//                         {item?.notification_type === "follow" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               starting following you.
//                             </Text>
//                           </View>
//                         )}

//                         {item?.notification_type === "Post Comment Like" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               liked your comment
//                             </Text>
//                           </View>
//                         )}
//                         {item?.notification_type === "post_comment_reply" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               replied to your comment
//                             </Text>
//                           </View>
//                         )}
//                         {item?.notification_type ===
//                           "post_comment_reply_like" && (
//                           <View>
//                             <Text style={styles.discription}>
//                               liked your reply
//                             </Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                     <View style={styles.dateContainer}>
//                       <Text style={[styles.discription, { fontSize: 12 }]}>
//                         {formatDate(item.date_created)}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               );
//             }}
//             ItemSeparatorComponent={renderSeparator}
//           />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default TotalNotification;

import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../utils";
import { RfH, RfW } from "../../utils/helper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNotification } from "../../redux/NotificationReducer";
import { notificationStatusUpdate } from "../../redux/SocialReducer";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useNavigation } from "@react-navigation/native";

const TotalNotification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [allRead, setAllRead] = useState(false);
  const TotalNotifications = useSelector((state) => state.notification.data);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllNotification());
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [dispatch]);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderNoRepliesMessage = () => {
    return (
      <View style={styles.loaderContainer}>
        <Text>No notifications available.</Text>
      </View>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${hours}:${formattedMinutes}`;
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(notificationStatusUpdate()).unwrap();
      setAllRead(true);
    } catch (err) {
      console.error("Failed to update notification status:", err);
    }
  };

  const renderListHeader = () => {
    return (
      <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.8}>
        <AntDesign
          name={allRead ? "checkcircle" : "checkcircleo"}
          size={20}
          style={{ alignSelf: "flex-end" }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingTop: RfH(15),
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftItem}
        >
          <AntDesign name="left" size={20} color={colors.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Notification</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.skyblue} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <FlatList
            data={TotalNotifications}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderNoRepliesMessage}
            ListHeaderComponent={renderListHeader}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Commentscreen", {
                      postId: item?.post?.id,
                      item: item?.comment?.id,
                    })
                  }
                  style={styles.flatlistcontainer}
                >
                  <View style={styles.rowContainer}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.imgcontainer}>
                        {item?.sender?.picture ? (
                          <Image
                            source={{
                              uri: `https://stage.suniyenetajee.com${item?.sender?.picture}`,
                            }}
                            style={styles.profilepicsty}
                          />
                        ) : (
                          <Image
                            source={require("../../assets/images/dummyplaceholder.png")}
                            style={styles.profilepicsty}
                          />
                        )}
                      </View>
                      <View style={styles.msgcontainer}>
                        <View style={styles.nameContainer}>
                          <Text style={styles.namesty}>
                            {item?.sender?.name?.length > 16
                              ? `${item?.sender?.name.slice(0, 16)}...`
                              : item?.sender?.name}
                          </Text>
                        </View>
                        <Text style={styles.discription}>
                          {item?.notification_type === "post_like" &&
                            "liked your post"}
                          {item?.notification_type === "post_comment" &&
                            "commented on your post"}
                          {item?.notification_type === "follow" &&
                            "started following you."}
                          {item?.notification_type === "Post Comment Like" &&
                            "liked your comment"}
                          {item?.notification_type === "post_comment_reply" &&
                            "replied to your comment"}
                          {item?.notification_type ===
                            "post_comment_reply_like" && "liked your reply"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dateContainer}>
                      <Text style={[styles.discription, { fontSize: 12 }]}>
                        {formatDate(item.date_created)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default TotalNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  container1: {
    paddingHorizontal: RfW(20),
    marginTop: RfH(15),
  },
  profilepicsty: {
    height: RfH(34),
    width: RfW(34),
    borderRadius: RfH(16),
    alignSelf: "center",
    resizeMode: "cover",
  },
  leftItem: {
    padding: RfH(5),
  },
  headerContainer: {
    width: 75,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 13,
    color: colors.black,
    left: 8,
  },
  nameContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },
  nodata: {
    alignSelf: "center",
    marginTop: "85%",
  },
  separator: {
    height: 1,
    width: "97%",
    backgroundColor: colors.primary_black,
    opacity: 0.1,
  },
  title: {
    fontSize: 20,
    top: RfH(3),
    fontWeight: "500",
    color: colors.black,
    fontFamily: "Poppins-Medium",
    alignSelf: "center",
    position: "absolute",
    left: RfW(90),
  },
  flatlistcontainer: {
    flexDirection: "row",
    marginVertical: RfH(15),
    width: "100%",
    justifyContent: "space-between",
  },
  txtsty: {
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  msgcontainer: {
    paddingHorizontal: RfW(10),
    justifyContent: "center",
    bottom: RfH(5),
  },
  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(34),
    width: RfW(34),
    borderRadius: RfH(18),
    justifyContent: "center",
  },
  namesty: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22.5,
    color: colors.primary_blue,
    fontFamily: "Poppins-Regular",
  },

  requestbtn: {
    backgroundColor: "red",
    width: RfW(170),
    right: RfW(20),
    height: RfH(40),
    justifyContent: "center",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  discription: {
    color: colors.DARK_GRAY,
  },
});
