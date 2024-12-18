import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://gmcmakoecwxkgtabkjwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY21ha29lY3d4a2d0YWJrand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODkwMDUsImV4cCI6MjA1MDA2NTAwNX0.Vlik45ieDFUC0s5jaMlL_IQZ_iotb9JOqOySnJMT4aU';

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
