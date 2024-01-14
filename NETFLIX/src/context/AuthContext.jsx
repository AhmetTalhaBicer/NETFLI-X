import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // Kullanıcı durumunu tutan state
  const [user, setUser] = useState(null);

  // Yeni bir kullanıcı kaydolma işlemi
  function signUp(email, password) {
    // FirebaseAuth üzerinden yeni bir kullanıcı oluştur
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Oluşturulan kullanıcının e-posta adresini kullanarak Firestore'da yeni bir doküman oluştur
        const userDocRef = doc(db, "users", userCredential.user.email);
        setDoc(userDocRef, {
          savedShows: [],
        });
      })
      .catch((error) => {
        console.error("Kullanıcı oluşturma hatası:", error);
      });
  }

  // Giriş yapma işlemi
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Çıkış yapma işlemi
  function logOut() {
    return signOut(auth);
  }

  // Firebase Authentication üzerindeki kullanıcı durumunu izleyen useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Kullanıcı durumu değiştiğinde state'i güncelle
      setUser(currentUser);
    });

    // Component unmount olduğunda kullanıcı durumu izlemeyi durdur
    return () => {
      unsubscribe();
    };
  }, []);

  // Context içinde sağlanan değerleri içeren provider bileşeni
  return (
    <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}
// AuthContextProvider bileşeni için beklenen prop tipleri belirlenir
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Dışarıdan erişim için kullanılan custom hook
export function UserAuth() {
  return useContext(AuthContext);
}
