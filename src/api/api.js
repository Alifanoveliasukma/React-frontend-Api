export const getRequestWithNativeFetch = async (url) => {
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }
  
    return response.json();
  };

  export const postRequestWithFetch = async (data) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }
  
    return response.json();
  };
  