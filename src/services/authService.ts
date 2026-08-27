import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// ✅ Save user info in localStorage immediately
const updateUserState = (user: User | null) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

// ✅ Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  updateUserState(user);
});

// ✅ Login function (Instantly updates user state)
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    updateUserState(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// ✅ SignUp function (Instantly updates user state)
export const signUp = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    updateUserState(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

// ✅ Logout function (Clears user instantly)
export const logout = async () => {
  await signOut(auth);
  updateUserState(null);
};

// ✅ Get current user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};
