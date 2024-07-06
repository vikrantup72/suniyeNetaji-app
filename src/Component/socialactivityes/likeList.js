import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils';
import {RfH, RfW, getKey} from '../../utils/helper';
import Header from '../../utils/Header';
import CustomImage from '../CustomImage';

const LikeList = ({route, navigation}) => {
  const item = route?.params?.item;
  const id = item?.id;

  const [data, setData] = useState([]);
  console.log(data, 'sbjmb');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikelist = async () => {
      try {
        const token = await getKey('AuthKey');
        const requestOptions = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        };
        const response = await fetch(
          `https://apis.suniyenetajee.com/api/v1/cms/post/like-list/${id}/`,
          requestOptions,
        );
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          console.error(
            'Error response:',
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikelist();
  }, [id]);

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderListItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('UserProfile', {item})}
        style={styles.flatlistcontainer}>
        {item.picture ? (
          <Image
            source={{
              uri: `https://apis.suniyenetajee.com${item.picture}`,
            }}
            style={{borderRadius: RfH(20), height: 40, width: 40}}
          />
        ) : (
          <Image
            source={require('../../assets/images/dummyplaceholder.png')}
            style={{borderRadius: RfH(20), height: 40, width: 40}}
          />
        )}
        <View style={styles.msgcontainer}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.namesty}>{item?.full_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header HeaderTxt={'Likes'} />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
          <ActivityIndicator size="small" color={colors.primary_blue} />
        </View>
      ) : (
        <View>
          <View style={styles.container1}>
            <FlatList
              data={data?.results}
              renderItem={renderListItem}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              ItemSeparatorComponent={renderSeparator}
              ListEmptyComponent={<Text>No data available</Text>}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LikeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  container1: {
    paddingHorizontal: RfW(20),
    marginTop: RfH(15),
  },
  separator: {
    height: 1,
    width: '97%',
    backgroundColor: colors.primary_black,
    opacity: 0.1,
    alignSelf: 'center',
  },
  flatlistcontainer: {
    flexDirection: 'row',
    marginVertical: RfH(15),
    width: '95%',
  },
  msgcontainer: {
    paddingHorizontal: RfW(10),
    justifyContent: 'center',
  },
  namesty: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22.5,
    color: colors.primary_black,
    fontFamily: 'Poppins-Regular',
  },
  msgsty: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
});
