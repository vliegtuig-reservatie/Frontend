import { getAuth } from '@firebase/auth'

declare global {
  interface Window {
    _env_: any
  }
}

export default () => {
  const query = async (name: string, query: string, variables?: Object) => {
    const res = await fetch(`${window._env_.backendUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getAuth().currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then(res => res.json())
      .catch(error => console.error({ error }))

    return res.data[name]
  }

  return {
    query,
  }
}
