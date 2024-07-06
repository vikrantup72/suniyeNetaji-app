import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import Header from '../../utils/Header';

const VotedScreen = () => {
  const [poll, setPoll] = useState([]);
  console.log(poll, 'lhnkj');
  const [loading, setLoading] = useState(true);

  const VotedPoll = async () => {
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
        'https://apis.suniyenetajee.com/api/v1/polling/voted-polling/',
        requestOptions,
      );
      if (response.ok) {
        const responseData = await response.json();
        setPoll(responseData?.results);
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
    VotedPoll();
  }, []);

  const getBarColor = percentage => {
    if (percentage >= 100) {
      return colors.backgroundfadeColor;
    } else if (percentage >= 75) {
      return colors.backgroundfadeColor;
    } else if (percentage >= 50) {
      return colors.backgroundfadeColor;
    } else if (percentage >= 25) {
      return colors.backgroundfadeColor;
    } else {
      return colors.backgroundfadeColor;
    }
  };

  // const getBarColor = percentage => {
  //   return colors.backgroundfadeColor;
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header HeaderTxt={'Poll Review'} />
      </View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={poll}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.pollcontainer}>
              <View>
                <Text style={styles.msgsty}>{item?.question}</Text>
              </View>
              <View>
                {item?.choices?.map(choice => {
                  const percentage = parseFloat(choice.percentage);
                  return (
                    <View style={styles.pollcon} key={choice.id}>
                      <View style={styles.choiceContainer}>
                        <Text style={styles.txtsty}>{choice.choice_text}</Text>
                        <View
                          style={[
                            styles.bar,
                            {
                              width: `${percentage}%`,
                              backgroundColor: getBarColor(percentage),
                              height: RfH(38),
                            },
                          ]}
                        />
                        <Text style={styles.percentageText}>
                          {choice.percentage.length > 4
                            ? `${choice.percentage.slice(0, 4)}`
                            : choice.percentage}
                          %
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default VotedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  pollcontainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: RfH(20),
    paddingVertical: RfH(10),
    paddingHorizontal: RfW(20),
    borderRadius: RfH(8),
    backgroundColor: colors.shadwo_blue,
  },
  txtsty: {
    fontWeight: '400',
    fontSize: 13,
    color: colors.black,
    height: 18,
    fontFamily: 'Poppins-Regular',
  },
  msgsty: {
    marginVertical: RfH(10),
    fontWeight: '400',
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    left: RfW(2),
  },
  pollcon: {
    borderWidth: 1,
    marginVertical: RfH(8),
    height: RfH(40),
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: colors.GRAY,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    height: '100%',
    left: RfW(-9),
    top: RfH(-7),
    borderRadius: 5,
  },
  percentageText: {
    zIndex: 1,
    fontWeight: '400',
    fontSize: 13,
    color: colors.black,
    fontFamily: 'Poppins-Regular',
  },
});
