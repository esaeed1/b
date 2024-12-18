import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ymyztsxdqmiklnsjurhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteXp0c3hkcW1pa2xuc2p1cmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNDA3MzQsImV4cCI6MjA0OTgxNjczNH0.dGJ9LjCTGvGzUrSQfln_nxiIrxXNBy57Z98b8G7yZqk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchItems() {
    try {
        const { data, error } = await supabase.from('items').select('*');
        if (error) {
            console.error('Supabase error:', error);
            return;
        }
        console.log('Fetched items:', data);
        const container = document.getElementById('items-container');
        container.innerHTML = '';
        data.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${item.img}" alt="${item.name}" style="max-width: 100px;">
                <p>UPC: ${item.upc}</p>
                <p>Quantity: ${item.quantity}</p>
                <a href="${item.link}" target="_blank">View Item</a>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

fetchItems();
