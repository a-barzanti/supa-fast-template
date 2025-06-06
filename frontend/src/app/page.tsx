'use client';

import { useEffect, useState } from 'react';
import type { Item, ItemsResponse } from './types';

const API_BASE = 'http://localhost:8000/api/v1';

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/items/get-items`);
      const data: Item[] | ItemsResponse = await res.json();
      if (Array.isArray(data)) {
        setItems(data as Item[]);
      } else if ('data' in data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to load items', err);
    }
  };

  const createItem = async () => {
    try {
      await fetch(`${API_BASE}/items/create-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      setTitle('');
      setDescription('');
      fetchItems();
    } catch (err) {
      console.error('Failed to create item', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Item Manager</h1>
      <ul className="space-y-2 mb-6">
        {items.map((item) => (
          <li key={item.id} className="border rounded p-2">
            <span className="font-semibold">{item.title}</span>
            {item.description && (
              <p className="text-sm text-gray-700">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="space-y-2 flex flex-col">
        <input
          className="border rounded p-2 text-black"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded p-2 text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={createItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>
    </main>
  );
}
