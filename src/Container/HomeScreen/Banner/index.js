import React, { useEffect } from "react";
import { StyleSheet, View, Image, SafeAreaView } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdvertisementdata } from "../../../redux/SocialReducer";
import { RfH, RfW } from "../../../utils/helper";
import { colors } from "../../../utils";

const BannerScreen = () => {
  const dispatch = useDispatch();
  const { advertisementData, loading, error } = useSelector(
    (state) => state.social
  );

  console.log(advertisementData, "advertisementData");

  useEffect(() => {
    dispatch(fetchAdvertisementdata());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        autoplayLoop
        index={0}
        ListEmptyComponent={() => <View style={styles.bannerContainer} />}
        data={advertisementData}
        renderItem={({ item }) => (
          <View style={styles.bannerContainer}>
            <Image
              source={{
                uri: `https://stage.suniyenetajee.com${item?.image}`,
              }}
              style={styles.bannerImage}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  bannerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: RfH(200),
    borderRadius: RfH(15),
    marginHorizontal: RfW(19),
    marginTop: RfH(15),
    alignSelf: "center",
    width: RfW(337),
    backgroundColor: colors.shadwo_blue,
  },
  bannerImage: {
    width: RfW(337),
    height: "100%",
    borderRadius: RfH(15),
    alignSelf: "center",
  },
});

export default React.memo(BannerScreen);
