type AppFetch = {
  url: string;
  method?: 'GET' | 'POST';
  body?: Record<string, any>;
};
export const appFetch = ({url, method = 'GET', body}: AppFetch) =>
  fetch('http://localhost:5000' + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .catch(e => {
      console.log(e);
      throw new Error(e);
    });
