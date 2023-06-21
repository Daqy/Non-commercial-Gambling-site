import { game } from './game'

export const mockToken = 'test'

export const mock = {
  '/api/login': () =>
    new Promise((resolve, reject) => {
      console.log('login')
      // mockToken = '123asd12asmdoinj1cu1i23njnasd'
      resolve({ token: mockToken })
    }),
  '/api/auth': () =>
    new Promise((resolve, reject) => {
      console.log('auth')
      if (mockToken) {
        resolve({ token: mockToken })
      } else {
        reject('not auth')
      }
    }),
  '/api/latest-game': () =>
    new Promise((resolve, reject) => {
      console.log('latest game')
      if (mockToken) {
        resolve(game.LOST)
      } else {
        reject('not auth')
      }
    }),
  '/api/create-game': () =>
    new Promise((resolve, reject) => {
      console.log('create game')
      resolve('test')
    })
}
