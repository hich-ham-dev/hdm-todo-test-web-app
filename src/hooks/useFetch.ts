export default function useFetch() {
  const callApi = async (method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH', route: string, data?: Record<string, any>) => {
    try {
      const myHeaders = new Headers();
      myHeaders.set('Accept', 'application/json');
      myHeaders.set('Content-Type', 'application/json');
      const requestOptions = {
        method,
        headers: myHeaders,
        cache: 'no-cache' as RequestCache,
        ...(data ? { body: JSON.stringify(data) } : {}),
      };
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${route}`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      throw error;
    }
  };

  return {
    get: (route: string) => callApi('GET', route),
    post: (route: string, data: Record<string, any>) => callApi('POST', route, data),
    put: (route: string, data: Record<string, any>) => callApi('PUT', route, data),
    patch: (route: string, data: Record<string, any>) => callApi('PATCH', route, data),
    delete: (route: string, data: Record<string, any>) => callApi('DELETE', route, data),
  };
}
