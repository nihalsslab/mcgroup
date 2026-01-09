"use client";

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function EntryForm({ onAdd }: { onAdd: () => void }) {
    const [caption, setCaption] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caption || !amount) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'transactions'), {
                caption,
                amount: parseFloat(amount),
                type,
                createdAt: new Date(),
            });
            setCaption('');
            setAmount('');
            onAdd(); // Trigger refresh or update parent state
        } catch (error: any) {
            console.error("Error adding document: ", error);
            alert("Error adding transaction: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 className="title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                Add Transaction
            </h2>
            <div className="grid-2">
                <div className="input-group">
                    <label>Caption</label>
                    <input
                        type="text"
                        placeholder="e.g. Groceries, Salary"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="input-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        placeholder="₹ 0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="input-group">
                <label>Type</label>
                <div className="grid-2">
                    <button
                        type="button"
                        className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setType('income')}
                        style={{ width: '100%' }}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`btn ${type === 'expense' ? 'btn-destructive' : 'btn-secondary'}`}
                        onClick={() => setType('expense')}
                        style={{ width: '100%' }}
                    >
                        Expense
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} style={{ marginRight: '0.5rem' }} />}
                Add Entry
            </button>
        </form>
    );
}
