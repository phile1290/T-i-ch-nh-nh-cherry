import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../../types';
import { db, collection, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc } from '../firebase';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const addTransaction = useCallback(async (t: Transaction) => {
    try {
      await setDoc(doc(db, 'transactions', t.id), t);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, []);
  
  const updateTransaction = useCallback(async (updatedTx: Transaction) => {
    try {
      const txRef = doc(db, 'transactions', updatedTx.id);
      await updateDoc(txRef, updatedTx as any);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }, []);

  return { transactions, addTransaction, updateTransaction, deleteTransaction, loading };
}
