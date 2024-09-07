import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../utils';
import {RfH, RfW, getKey} from '../../utils/helper';
import {useNavigation} from '@react-navigation/native';
import Header from '../../utils/Header';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import {setFollowedUserId} from '../../redux/DataSource';
import { useAndroidBackHandler } from 'react-navigation-backhandler';

const FindFriendsScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const {isFollowedUserId} = useSelector(state => state.dataSource);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData('https://stage.suniyenetajee.com/api/v1/account/users/');
  }, []);

  useAndroidBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false; // Let the system handle the back button event
  });

  useEffect(() => {
    if (query.length > 0) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
    filterData(query);
  }, [query]);

  const fetchData = async url => {
    setLoading(true);
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      setData(result.results);
      setFilteredData(result.results);
      setNextPageUrl(result.next);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (nextPageUrl && !loadingMore) {
      setLoadingMore(true);
      try {
        const token = await getKey('AuthKey');
        const response = await fetch(nextPageUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        const result = await response.json();
        setData(prevData => {
          const newData = result.results.filter(
            item => !prevData.some(prevItem => prevItem.id === item.id),
          );
          return [...prevData, ...newData];
        });
        setFilteredData(prevData => {
          const newData = result.results.filter(
            item => !prevData.some(prevItem => prevItem.id === item.id),
          );
          return [...prevData, ...newData];
        });
        setNextPageUrl(result.next);
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const fetchSuggestions = debounce(async searchQuery => {
    setLoading(true);
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        `https://stage.suniyenetajee.com/api/v1/account/users/?search=${searchQuery}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      const result = await response.json();
      setSuggestions(result.results);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, 1000);

  const handleSearch = async () => {
    if (query.length > 3) {
      setLoading(true);
      try {
        const token = await getKey('AuthKey');
        const response = await fetch(
          `https://stage.suniyenetajee.com/api/v1/account/users/?search=${query}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Token ${token}`,
            },
          },
        );
        const result = await response.json();
        setFilteredData(result.results);
        setSuggestions([]);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filterData = searchQuery => {
    if (searchQuery.length > 2) {
      const filtered = data.filter(item =>
        item.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleFollowUnfollow = async (id, index) => {
    setLoadingStates(prevState => ({...prevState, [id]: true}));
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('type', 'follow');
    try {
      const token = await getKey('AuthKey');
      const response = await fetch(
        'https://stage.suniyenetajee.com/api/v1/account/follow-unfollow/',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
          body: formData,
        },
      );
      const result = await response.json();
      const postItem = [
        {
          id: id,
          isPending: true,
        },
      ];
      dispatch(setFollowedUserId(postItem));
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setLoadingStates(prevState => ({...prevState, [id]: false}));
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('UserProfile', {item})}>
        {item?.picture ? (
          <Image
            source={{uri: `https://stage.suniyenetajee.com${item.picture}`}}
            style={{
              height: RfH(50),
              width: RfW(50),
              borderRadius: RfH(25),
              resizeMode: 'cover',
            }}
          />
        ) : (
          <Image
            source={require('../../assets/images/dummyplaceholder.png')}
            style={{
              height: RfH(50),
              width: RfW(50),
              borderRadius: RfH(25),
              resizeMode: 'cover',
            }}
          />
        )}
        <Text style={styles.itemText}>{item.full_name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleFollowUnfollow(item.id, index)}
        style={[
          styles.followBtn,
          item.is_following && !item.is_pending_request
            ? styles.followedBtn
            : item.is_pending_request ||
              isFollowedUserId[item?.id]?.isPending
            ? styles.followedBtn
            : styles.followedBtn2,
        ]}
        disabled={loadingStates[item.id]}>
        {loadingStates[item.id] ? (
          <ActivityIndicator size="small" color={colors.WHITE} />
        ) : (
          <Text
            style={[
              styles.followtxt,
              item.is_following ||
              item.is_pending_request ||
              item.is_following ||
              isFollowedUserId[item?.id]?.isPending
                ? {color: colors.WHITE}
                : {color: colors.black},
            ]}>
            {item.is_pending_request ||
            isFollowedUserId[item?.id]?.isPending
              ? 'Pending'
              : item.is_following
              ? 'Following'
              : 'Follow'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSuggestionItem = ({item, index}) => (
    <TouchableOpacity onPress={() => setQuery(item.full_name)} key={index}>
      <Text style={styles.suggestionText}>{item.full_name}</Text>
    </TouchableOpacity>
  );

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <StatusBar
        animated={true}
        backgroundColor={colors.WHITE}
        barStyle={'dark-content'}
      />
      <Header onPress={() => navigation.goBack()} />

      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users"
          value={query}
          onChangeText={text => {
            setQuery(text);
            if (text.length === 0) {
              setSuggestions([]);
            }
          }}
          onSubmitEditing={handleSearch}
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderSuggestionItem}
            style={styles.suggestionsList}
          />
        )}
        {loading && !loadingMore ? (
          <ActivityIndicator
            size="small"
            color={colors.skyblue}
            style={styles.loadingsty}
          />
        ) : (
          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore && (
                <ActivityIndicator size="small" color={colors.skyblue} />
              )
            }
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No results found</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RfH(16),
  },
  searchInput: {
    height: RfH(40),
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: RfH(16),
  },
  suggestionsList: {
    maxHeight: 200,
    marginBottom: 16,
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
  },
  suggestionText: {
    padding: 8,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RfH(8),
    justifyContent: 'space-between',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.black,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: colors.GRAY,
  },
  loadingsty: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: RfH(30),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.GRAY,
  },
  followBtn: {
    width: RfW(77),
    height: RfH(25),
    // borderWidth: 1,
    borderColor: colors.black,
    borderRadius: RfH(7),
    justifyContent: 'center',
    marginHorizontal: RfW(20),
    marginTop: RfH(2),
    left: RfW(20),
  },
  followedBtn: {
    backgroundColor: colors.skyblue,
    borderColor: '#7966FF',
  },
  followedBtn2: {
    // backgroundColor: colors.skyblue,
    borderColor: colors.black,
    borderWidth: 0.7,
  },
  followtxt: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    top: RfH(1),
  },
});

export default FindFriendsScreen;
