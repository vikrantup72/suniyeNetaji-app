import { useEffect, useCallback } from 'react';

const useOnEndReached = (onEndReachedCallback, isLoading) => {
  const handleEndReached = useCallback(() => {
    if (!isLoading) {
      onEndReachedCallback();
    }
  }, [onEndReachedCallback, isLoading]);

  useEffect(() => {
    const handleScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
      const paddingToBottom = 20;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    };

    const onScroll = event => {
      const { nativeEvent } = event;
      if (handleScroll(nativeEvent) && !isLoading) {
        handleEndReached();
      }
    };

    return () => {
      scrollViewRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [handleEndReached, isLoading]);

  return handleEndReached;
};

export default useOnEndReached;
