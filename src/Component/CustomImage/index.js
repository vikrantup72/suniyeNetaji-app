import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { getIconImageStyle } from './styles';
import { colors } from '../../utils';
import { RfH, RfW, getImageSource } from '../../utils/helper';

function CustomImage(props) {
  const {
    submitFunction,
    image,
    imageHeight,
    style,
    imageResizeMode,
    imageWidth,
    placeHolderImage,
    containerStyling,
    activityIndicatorColor,
    displayLoader
  } = props;
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageObject = image ? getImageSource(image) : placeHolderImage;
  const sourceImage = isError ? getImageSource(placeHolderImage) : imageObject;
  return (
    <View style={{}}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!submitFunction}
        onPress={submitFunction}
        style={[containerStyling, {}]}>
        {loading && displayLoader && (
          <View
            style={[
              {
                position: 'absolute',
                left: imageWidth / 2 - RfW(10),
                top: imageHeight / 2 - RfH(10)
              },
              style
            ]}>
            <ActivityIndicator color={activityIndicatorColor} />
          </View>
        )}
        <Image
          source={sourceImage}
          onError={() => {
            setIsError(true);
            setLoading(false);
          }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onLoadEnd={() => setLoading(false)}
          style={[
            getIconImageStyle(imageHeight, imageWidth),
            style,
            {
              resizeMode: imageResizeMode
            }
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

CustomImage.propTypes = {
  backgroundColor: PropTypes.string,
  containerStyling: PropTypes.object,
  imageHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  image: PropTypes.any,
  imageWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageResizeMode: PropTypes.string,
  placeHolderImage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.any,
  submitFunction: PropTypes.func,
  activityIndicatorColor: PropTypes.any,
  displayLoader: PropTypes.bool
};

CustomImage.defaultProps = {
  backgroundColor: '#000000',
  imageHeight: 50,
  imageWidth: 50,
  imageResizeMode: 'contain',
  style: {},
  containerStyling: {},
  submitFunction: null,
  placeHolderImage: null,
  displayLoader: true,
  activityIndicatorColor: colors.blue
};

export default CustomImage;
