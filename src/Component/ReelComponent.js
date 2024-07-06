// import React, {useState, useRef} from 'react';
// import {View, ActivityIndicator, FlatList, Dimensions} from 'react-native';
// import Video from 'react-native-video';

// const ReelComponent = () => {
//   const videos = [
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//52_3284_20240529163435_202405291634331000162031mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//43_7566_20240529155935_202405291559321000110486mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://apis.clickntokk.com/reels/stream/?video_url=https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//74_20240401210551_202404012105431000087073mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//43_1241_20240529181802_202405291817581000110507mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//52_3284_20240529163435_202405291634331000162031mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//43_7566_20240529155935_202405291559321000110486mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://apis.clickntokk.com/reels/stream/?video_url=https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//74_20240401210551_202404012105431000087073mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//     {
//       description:
//         'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org',
//       sources: [
//         'https://clickntokk.s3.ap-south-1.amazonaws.com/reel_data//43_1241_20240529181802_202405291817581000110507mp4.mp4',
//       ],
//       subtitle: 'By Blender Foundation',
//       thumb: 'images/TearsOfSteel.jpg',
//       title: 'Tears of Steel',
//     },
//   ];

//   const [activeVideoIndex, setActiveVideoIndex] = useState(0);
//   const videoRefs = useRef(videos.map(() => React.createRef()));
//   const [preloadedVideos, setPreloadedVideos] = useState(
//     Array(videos.length).fill(false),
//   );

//   const handleLoadStart = index => {
//     console.log('loading start', index);
//     // Update preloadedVideos when video loading starts
//     const newPreloadedVideos = [...preloadedVideos];
//     newPreloadedVideos[index] = false;
//     setPreloadedVideos(newPreloadedVideos);
//   };

//   const handleLoad = index => {
//     console.log('handle loading', index);
//     // Update preloadedVideos when video loading completes
//     const newPreloadedVideos = [...preloadedVideos];
//     newPreloadedVideos[index] = true;
//     setPreloadedVideos(newPreloadedVideos);
//   };

//   const renderItem = ({item, index}) => {
//     return (
//       <View
//         style={{
//           width: Dimensions.get('window').width,
//           height: Dimensions.get('window').height,
//         }}>
//         <View
//           style={{
//             width: Dimensions.get('window').width,
//             height: Dimensions.get('window').height - 80,
//           }}>
//           <Video
//             ref={videoRefs.current[index]}
//             source={{uri: item?.sources[0]}}
//             repeat={true}
//             paused={index !== activeVideoIndex}
//             onLoadStart={() => handleLoadStart(index)}
//             onLoad={() => handleLoad(index)}
//             style={{
//               height: '100%',
//             }}
//             resizeMode="contain"
//           />
//           {!preloadedVideos[index] && (
//             <View
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{height: Dimensions.get('window').height}}>
//       <FlatList
//         data={videos}
//         style={{flex: 1}}
//         renderItem={renderItem}
//         pagingEnabled
//         onScroll={e => {
//           const index = Math.round(
//             e.nativeEvent.contentOffset.y / Dimensions.get('window').height,
//           );
//           setActiveVideoIndex(index);
//         }}
//       />
//     </View>
//   );
// };

// export default ReelComponent;

import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { colors } from '../utils';
import { RfH } from '../utils/helper';
import Header from '../utils/Header';

const ReelComponent = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header HeaderTxt={'Massage'} />
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          flex: 1,
          bottom: RfH(30),
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            alignSelf: 'center',
            marginTop: RfH(10),
            fontSize: 20,
            color: colors.skyblue,
          }}>
          Work in progress..
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReelComponent;

const styles = StyleSheet.create({});
