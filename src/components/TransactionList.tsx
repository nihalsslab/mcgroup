"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, Edit2, Check, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Transaction {
    id: string;
    caption: string;
    amount: number;
    type: 'income' | 'expense';
    createdAt: any;
}

export default function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCaption, setEditCaption] = useState('');
    const [editAmount, setEditAmount] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[];
            setTransactions(items);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            await deleteDoc(doc(db, 'transactions', id));
        }
    };

    const startEdit = (t: Transaction) => {
        setEditingId(t.id);
        setEditCaption(t.caption);
        setEditAmount(t.amount.toString());
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditCaption('');
        setEditAmount('');
    };

    const saveEdit = async (id: string) => {
        try {
            await updateDoc(doc(db, 'transactions', id), {
                caption: editCaption,
                amount: parseFloat(editAmount)
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Error updating transaction");
        }
    };

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpense;

    return (
        <div>
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
                <div className="card text-center" style={{ marginBottom: 0 }}>
                    <div className="text-sm">Income</div>
                    <div className="amount-income" style={{ fontSize: '1.5rem' }}>+${totalIncome.toFixed(2)}</div>
                </div>
                <div className="card text-center" style={{ marginBottom: 0 }}>
                    <div className="text-sm">Expense</div>
                    <div className="amount-expense" style={{ fontSize: '1.5rem' }}>-${totalExpense.toFixed(2)}</div>
                </div>
                <div className="card text-center" style={{ marginBottom: 0 }}>
                    <div className="text-sm">Net Profit</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: profit >= 0 ? 'HSL(var(--primary))' : 'HSL(var(--destructive))' }}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>History</h2>

                {transactions.length === 0 ? (
                    <p className="text-center transaction-list text-sm" style={{ padding: '2rem 0' }}>No transactions yet.</p>
                ) : (
                    <div className="transaction-list">
                        {transactions.map((t) => (
                            <div key={t.id} className="transaction-item">
                                {editingId === t.id ? (
                                    <div style={{ width: '100%', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            value={editCaption}
                                            onChange={e => setEditCaption(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                        <input
                                            type="number"
                                            value={editAmount}
                                            onChange={e => setEditAmount(e.target.value)}
                                            style={{ marginBottom: 0, width: '100px' }}
                                        />
                                        <button onClick={() => saveEdit(t.id)} className="icon-btn" style={{ color: 'green' }}><Check size={18} /></button>
                                        <button onClick={cancelEdit} className="icon-btn" style={{ color: 'red' }}><X size={18} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {t.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{t.caption}</div>
                                                <div className="text-sm">{t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleDateString() : 'Date Pending'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </span>
                                            <div style={{ display: 'flex' }}>
                                                <button onClick={() => startEdit(t)} className="icon-btn"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(t.id)} className="icon-btn" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
