import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../../types';
import { db, auth, collection, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc, signInWithPopup, googleProvider, signOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'transactions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((doc) => {
        txs.push(doc.data() as Transaction);
      });
      // Sort by timestamp descending
      txs.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Error signing in:", e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  const addTransaction = useCallback(async (t: Transaction) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'transactions', t.id), t);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, [user]);
  
  const updateTransaction = useCallback(async (updatedTx: Transaction) => {
    if (!user) return;
    try {
      const txRef = doc(db, 'transactions', updatedTx.id);
      await updateDoc(txRef, updatedTx as any);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, [user]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }, [user]);

  return { transactions, addTransaction, updateTransaction, deleteTransaction, loading, user, authInitialized, signIn, logout };
}
