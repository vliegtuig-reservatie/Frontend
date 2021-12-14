// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { readonly, ref, Ref } from 'vue'
import useGraphQL from './useGraphQL'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDATgU6ZotKXNVo86MorMBxKK1gDYgmLbs',
  authDomain: 'vliegtuig-reservatie.firebaseapp.com',
  projectId: 'vliegtuig-reservatie',
  storageBucket: 'vliegtuig-reservatie.appspot.com',
  messagingSenderId: '960074032002',
  appId: '1:960074032002:web:085ec53d78537d588de59b',
  measurementId: 'G-VMRN6SQLZE',
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig)
const auth = getAuth()

setPersistence(auth, browserLocalPersistence)

const user: Ref<User | null> = ref(auth.currentUser)

export default () => {
  const { query } = useGraphQL()
  const restoreAuth = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        auth.onAuthStateChanged(async state => {
          if (state) {
            user.value = state
            console.log(user.value)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      } catch (error) {
        reject(false)
      }
    })
  }

  const createUser = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          user.value = userCredential.user
          const response = await query(
            `createUser`,
            `mutation createUser($data: UserInput = {id: "", firstName: "", lastName: "", email: ""}) {
            createUser(data: $data) {
              id
              firstName
              lastName
              email
            }
          }`,
            {
              data: {
                id: user.value?.uid,
                firstName: firstName,
                lastName: lastName,
                email: email,
              },
            },
          )
          await user.value.getIdToken(true)
          resolve(true)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          reject(false)
        })
    })
  }

  const login = (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          user.value = userCredential.user
          resolve(true)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          reject(false)
        })
    })
  }

  const resetPassword = (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          resolve(true)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          reject(false)
        })
    })
  }

  const logout = () => {
    return signOut(auth)
  }

  return {
    createUser,
    restoreAuth,
    login,
    logout,
    resetPassword,

    user: readonly(user),
  }
}
