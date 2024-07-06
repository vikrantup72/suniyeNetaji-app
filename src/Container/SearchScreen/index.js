import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import RNPoll from 'react-native-poll';
import Header from '../../utils/Header';

const SearchScreen = ({navigation}) => {
  const [poll, setPoll] = useState([]);
  console.log(poll, 'uhjn');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const Polls = async () => {
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
        'https://apis.suniyenetajee.com/api/v1/polling/get-polling/',
        requestOptions,
      );
      if (response.ok) {
        const responseData = await response.json();
        setPoll(responseData);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Polls();
  }, []);

  const votesemmenary = [
    {id: 1, semmenary: 'Voting'},
    {id: 2, semmenary: 'Voted'},
  ];

  const handlePress = id => {
    setSelectedId(id);
  };

  const handleChoicePress = async (selectedChoice, pollId) => {
    console.log(selectedChoice, 'selectedChoice');
    // setLoading(true); // Set loading to true when the POST API call begins
    try {
      const token = await getKey('AuthKey');
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          id: selectedChoice?.id,
        }),
      };
      const response = await fetch(
        `https://apis.suniyenetajee.com/api/v1/polling/${pollId}/vote/`,
        requestOptions,
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log('Vote successful:', responseData);
        ToastAndroid.show('Vote recorded', ToastAndroid.BOTTOM);
        setPoll(prevPoll => prevPoll.filter(item => item.id !== pollId));
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      // setLoading(false); // Set loading to false when the POST API call is complete
    }
  };

  const renderPollItem = ({item}) => {
    return (
      <SafeAreaView style={styles.pollItem}>
        <Text style={styles.msgtextsty}>{item.question}</Text>
        {item.choices && item.choices.length > 0 ? (
          <RNPoll
            appearFrom="left"
            animationDuration={750}
            choices={item.choices.map(choice => ({
              id: choice.id,
              choice: choice.choice_text,
            }))}
            style={styles.polls}
            pollContainerStyle={styles.pollssty}
            choiceTextStyle={styles.choiceTextStyle}
            selectedChoiceBorderWidth={1.5}
            onChoicePress={selectedChoice =>
              handleChoicePress(selectedChoice, item.id)
            }
            renderChoice={(choice, selected, handlePress) => (
              <TouchableOpacity
                key={choice.id}
                onPress={handlePress}
                style={[styles.choiceItem, selected && styles.selectedChoice]}>
                <Text style={styles.choiceText}>{choice.choice}</Text>
                {selected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No choices available</Text>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        HeaderTxt={'Election Poll'}
        ProfileImage={require('../../assets/images/notificationbell.png')}
        onPress={() => navigation.navigate('Notification')}
      />
      <View style={{marginHorizontal: 20}}>
        <View style={{width: '100%'}}>
          <Text style={styles.headingtxtsty}>
            Through this poll you can choose the best leader who will always be
            there for you and who will develop your area. Thanks for vote.
          </Text>
        </View>
        <View style={styles.btncon}>
          {votesemmenary.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                item.id == 2 ? navigation.navigate('VotedScreen') : null
              }
              style={[
                styles.voteItem,
                {
                  backgroundColor:
                    item.id == 1 ? colors.shadwo_blue : 'transparent',
                },
              ]}>
              <View style={styles.voteItemContent}>
                <Text style={styles.semmenarysty}>{item.semmenary}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loader}
        />
      ) : ( */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            data={poll}
            renderItem={renderPollItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={() =>
              !loading && (
                <Text style={styles.nopollsty}>No polls available</Text>
              )
            }
          />
        </View>
      </ScrollView>
      {/* )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  contentContainer: {
    paddingHorizontal: RfW(20),
  },
  voteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteItem: {
    marginVertical: 5,
    borderWidth: 1,
    height: RfH(40),
    justifyContent: 'center',
    width: '45%',
    borderRadius: RfH(10),
    alignSelf: 'center',
    borderColor: colors.GRAY,
  },
  voteItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollssty: {bottom: RfH(10)},
  imgcontainer: {
    backgroundColor: colors.GRAY,
    height: RfH(32),
    width: RfW(32),
    borderRadius: RfH(16),
    justifyContent: 'center',
  },
  polls: {},
  semmenarysty: {
    color: colors.primary_black,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  headingtxtsty: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: colors.black,
    lineHeight: 20,
    top: RfH(15),
  },
  pollItem: {
    paddingVertical: RfH(10),
    borderRadius: RfH(10),
    marginVertical: RfH(15),
    paddingHorizontal: RfW(10),
    backgroundColor: colors.shadwo_blue,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  choiceTextStyle: {
    fontWeight: '400',
    fontSize: 13,
    color: colors.black,
    height: 18,
    fontFamily: 'Poppins-Regular',
  },
  btncon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RfH(10),
    height: RfH(75),
  },
  choiceItem: {
    paddingVertical: RfH(5),
    paddingHorizontal: RfW(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedChoice: {
    backgroundColor: colors.light_blue,
  },
  choiceText: {
    fontSize: 14,
    color: colors.black,
  },
  checkMark: {
    fontSize: 18,
    color: colors.green,
  },
  msgtextsty: {
    marginTop: RfH(10),
    fontWeight: '400',
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    left: RfW(2),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nopollsty: {
    fontSize: 16,
    color: colors.primary_black,
    alignSelf: 'center',
    marginTop: '50%',
  },
});

export default SearchScreen;
