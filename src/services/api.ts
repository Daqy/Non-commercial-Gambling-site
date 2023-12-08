import { ref } from 'vue'
import axios from 'axios'
// import { mock } from '@/mock'

// const useMock = false

export const useApi = (endpoint: string): any => {
  const loading = ref(false)
  const data = ref()
  const error = ref()

  const get = (query?: any) => {
    loading.value = true
    error.value = undefined

    // if (useMock) {
    //   return mock[endpoint]()
    //     .then((response) => (data.value = response))
    //     .catch((error) => {
    //       error.value = error
    //       throw error
    //     })
    //     .finally(() => (loading.value = false))
    // }
    return axios
      .get(endpoint, query)
      .then((response) => (data.value = response.data))
      .catch((error) => {
        error.value = error
        throw error
      })
      .finally(() => (loading.value = false))
  }
  const post = (payload?: any) => {
    loading.value = true
    error.value = undefined
    // if (useMock) {
    //   return mock[endpoint]()
    //     .then((response) => (data.value = response))
    //     .catch((error) => {
    //       error.value = error
    //       throw error
    //     })
    //     .finally(() => (loading.value = false))
    // }
    return axios
      .post(endpoint, payload)
      .then((response) => (data.value = response.data))
      .catch((error) => {
        error.value = error
        throw error
      })
      .finally(() => (loading.value = false))
  }

  return {
    loading,
    data,
    error,
    get,
    post
  }
}
