import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {RfH, RfW, getKey} from '../../utils/helper';
import {colors} from '../../utils';
import {
  CreateExperience,
  createExperience,
  updateExperience,
} from '../../redux/ExperienceSlice';
const AddExperience = ({navigation, route}) => {
  const {id, flag} = route.params || {};
  const dispatch = useDispatch();
  const loading = useSelector(state => state.experience.loading);
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [startdate, setStartdate] = useState('');
  const [enddate, setEnddate] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [currently_working, setCurrently_working] = useState(false);
  const [loadings, setLoadings] = useState(false);

  const fetchExperienceDataById = async id => {
    if (!id) {
      return null;
    }
    setLoadings(true);
    try {
      const token = await getKey('AuthKey');
      const url = `https://stage.suniyenetajee.com/api/v1/account/experience/${id}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Error response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    fetchExperienceDataById(id);
  }, [id]);

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setCompany(data.company || '');
      setStartdate(data.start_date || '');
      setEnddate(data.end_date || '');
      setDescription(data.description || '');
      setCurrently_working(data.currently_working || false); // Ensure to set currently_working from fetched data
    }
  }, [data]);

  const toggleEndDate = () => {
    setCurrently_working(!currently_working);
    if (!currently_working) setEnddate('');
  };

  const handleSave = () => {
    dispatch(
      createExperience({
        navigation,
        title,
        start_date: startdate,
        company,
        end_date: enddate,
        description,
        currently_working,
      }),
    );
  };

  const handleEditExperience = () => {
    dispatch(
      updateExperience({
        id,
        navigation,
        title,
        start_date: startdate,
        company,
        end_date: enddate,
        description,
      }),
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.WHITE, flex: 1}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.crossbtnsty}>
        <Image
          source={require('../../assets/images/cross.png')}
          style={styles.crossimgsty}
        />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        {loadings ? (
          <ActivityIndicator
            size={'small'}
            color={colors.skyblue}
            style={styles.loadingsty}
          />
        ) : (
          <ScrollView contentContainerStyle={{paddingBottom: RfH(200)}}>
            <View style={styles.contantcontainer}>
              <View>
                <Text style={styles.headingtxt}>Add Experience</Text>
                <Text style={styles.titlesty}>
                  Here you can add your work experience and your journey.
                </Text>
              </View>

              <View style={{marginTop: RfH(15)}}>
                <View style={{marginVertical: RfH(0)}}>
                  <Text style={styles.headtxt}>Title</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex: Retail Sales Manager"
                    placeholderTextColor={colors.DARK_GRAY}
                    style={styles.input}
                  />
                  <View style={styles.bottombordersty}></View>
                </View>
                <View style={{marginVertical: RfH(0)}}>
                  <Text style={styles.headtxt}>Organization name</Text>
                  <TextInput
                    value={company}
                    onChangeText={setCompany}
                    placeholder="Ex: ClickNPay"
                    placeholderTextColor={colors.DARK_GRAY}
                    style={styles.input}
                  />
                  <View style={styles.bottombordersty}></View>
                </View>

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    onPress={toggleEndDate}
                    style={styles.checkbox}>
                    <Image
                      source={
                        currently_working
                          ? require('../../assets/images/checkbox.png')
                          : require('../../assets/images/checkbox2.png')
                      }
                      style={styles.checkboximgsty}
                    />
                    <Text style={styles.checkboxLabel}>
                      I am currently working in this role
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{marginTop: RfH(20)}}>
                  <Text style={styles.headtxt}>Start Date</Text>
                  <View style={[{height: RfH(45), justifyContent: 'center'}]}>
                    <TouchableOpacity
                      onPress={() => setOpen(true)}
                      style={{paddingHorizontal: RfW(5), marginTop: RfH(5)}}>
                      <Text style={{color: colors.primary_black}}>
                        {startdate ? startdate : 'Start Date'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="date"
                    onConfirm={date => {
                      setOpen(false);
                      setDate(date);
                      const formattedDate = date.toISOString().split('T')[0];
                      setStartdate(formattedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  <View style={styles.Datebottombordersty}></View>
                </View>
                {currently_working ? (
                  <View style={{marginTop: 10}}>
                    <Text style={styles.headtxt}>End Date</Text>
                    <TextInput
                      placeholder="Present"
                      placeholderTextColor={colors.DARK_GRAY}
                      style={styles.input}
                      editable={false}
                    />
                    <View style={styles.bottombordersty}></View>
                  </View>
                ) : (
                  <View style={{marginVertical: RfH(10)}}>
                    <Text style={styles.headtxt}>End Date</Text>
                    <View style={styles.inputField}>
                      <TouchableOpacity
                        onPress={() => setOpen2(true)}
                        style={styles.datePickerButton}>
                        <Text style={styles.datePickerText}>
                          {enddate ? enddate : 'End Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DatePicker
                      modal
                      open={open2}
                      date={date2}
                      mode="date"
                      onConfirm={date => {
                        setOpen2(false);
                        setDate2(date);
                        const formattedDate = date.toISOString().split('T')[0];
                        setEnddate(formattedDate);
                      }}
                      onCancel={() => {
                        setOpen2(false);
                      }}
                    />
                    <View style={styles.Datebottombordersty}></View>
                  </View>
                )}
                <View>
                  <Text style={[styles.headtxt, {top: RfH(10)}]}>
                    Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Max 150 characters"
                    placeholderTextColor={colors.DARK_GRAY}
                    style={styles.input}
                    maxLength={150}
                    multiline
                  />
                  <View style={styles.bottombordersty}></View>
                </View>
              </View>
            </View>
            {flag == 'EditExperience' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.updatebtn}
                onPress={handleEditExperience}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.WHITE} />
                ) : (
                  <Text style={styles.updatetxt}>Update Experience</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.updatebtn}
                onPress={handleSave}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.WHITE} />
                ) : (
                  <Text style={styles.updatetxt}>Add Experience</Text>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddExperience;

const styles = StyleSheet.create({
  crossimgsty: {
    height: RfH(16),
    width: RfW(16),
  },
  crossbtnsty: {
    paddingHorizontal: RfW(20),
    paddingVertical: RfH(20),
  },
  contantcontainer: {
    paddingHorizontal: RfW(20),
  },
  headingtxt: {
    color: colors.black,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginTop: RfH(3),
  },
  titlesty: {
    color: colors.black,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: RfH(10),
  },
  headtxt: {
    fontSize: 16,
    color: colors.black,
    marginTop: RfH(5),
  },
  bottombordersty: {
    borderBottomWidth: 1,
    marginBottom: RfH(8),
    bottom: 10,
    borderBottomColor: colors.DARK_GRAY,
  },
  Datebottombordersty: {
    borderBottomWidth: 1,
    marginBottom: RfH(3),
    borderBottomColor: colors.DARK_GRAY,
    bottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RfH(10),
    top: RfH(5),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.DARK_GRAY,
    left: RfW(12),
  },
  inputField: {height: RfH(45), justifyContent: 'center'},
  datePickerButton: {paddingHorizontal: RfW(5), marginTop: RfH(5)},
  datePickerText: {color: colors.primary_black},
  input: {
    color: colors.primary_black,
  },
  checkboximgsty: {
    height: RfH(24),
    width: RfH(24),
    tintColor: colors.skyblue,
  },
  updatebtn: {
    backgroundColor: '#7966FF',
    height: RfH(45),
    width: '90%',
    alignSelf: 'center',
    borderRadius: RfH(10),
    justifyContent: 'center',
    // position: 'absolute',
    top: RfH(40),
  },
  updatetxt: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontFamily: 'Poppins-Medium',
  },
  loadingsty: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
