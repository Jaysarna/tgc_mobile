

export function handleError(error) {

  console.error('API Error:', error);
  try {
    const jsonArray = JSON.parse(error.response.data._server_messages);


    if (Array.isArray(jsonArray) && jsonArray.length > 0) {
      const firstObject = JSON.parse(jsonArray[0]);
      const message = firstObject.message;
      const title = firstObject.title;
      const indicator = firstObject.indicator;
      const raiseException = firstObject.raise_exception;

      // console.log('Message:', message);
      return alert(title)
    } else {
      console.error('Invalid JSON structure');
    }
  }
  catch (err) {
    console.log(err)
  }
}