"use client";

import EntryForm from '@/components/EntryForm';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <main className="container">
      <h1 className="title" style={{ marginBottom: '0.5rem' }}>Finance Manager</h1>
      <p className="subtitle">Track your income and expenses effortlessly.</p>

      <EntryForm onAdd={() => { }} />
      <TransactionList />
    </main>
  );
}
