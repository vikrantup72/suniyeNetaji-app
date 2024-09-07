const BASE_URL = 'https://stage.suniyenetajee.com/';

export const CommentReplyData = async (endpoint, formData, token) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      },
      body: formData,
    });
    const responseData = await response.json();
    if (response.ok) {
      console.log('API response:', responseData);
      return responseData;
    } else {
      console.log('API error response:', responseData);
      throw new Error(responseData.detail || 'Unknown error');
    }
  } catch (error) {
    console.error('API error:', error.message);
    throw error;
  }
};
