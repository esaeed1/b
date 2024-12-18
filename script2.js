import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import Papa from 'https://cdn.jsdelivr.net/npm/papaparse/+esm';

const SUPABASE_URL = 'https://gmcmakoecwxkgtabkjwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY21ha29lY3d4a2d0YWJrand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODkwMDUsImV4cCI6MjA1MDA2NTAwNX0.Vlik45ieDFUC0s5jaMlL_IQZ_iotb9JOqOySnJMT4aU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch and display items
async function fetchItems() {
    try {
        const { data, error } = await supabase.from('items').select('*');
        if (error) {
            console.error('Error fetching items:', error);
            return;
        }

        const container = document.getElementById('admin-items');
        container.innerHTML = ''; // Clear previous items

        data.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <p>UPC: ${item.upc}</p>
                <p>Quantity: ${item.quantity}</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Function to add a single item
async function addItem() {
    const upc = document.getElementById('upc').value;
    const quantity = document.getElementById('quantity').value;

    if (!upc || !quantity) {
        alert('Please enter both UPC and quantity.');
        return;
    }

    console.log("Adding item:", { upc, quantity }); // Log data being sent

    try {
        const { data, error } = await supabase
            .from('items')
            .insert([{ upc, quantity: parseInt(quantity, 10) }]);

        if (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item.');
        } else {
            alert('Item added successfully!');
            fetchItems(); // Refresh items
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
}


// Function to process the uploaded CSV file
async function processCSV(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('Please select a CSV file.');
        return;
    }

    // Parse the CSV file
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
            console.log('Parsed CSV data:', results.data);
            await bulkUpdate(results.data);
        },
        error: function (error) {
            console.error('Error parsing CSV:', error);
            alert('Error reading CSV file.');
        }
    });
}

// Function to bulk update the database from CSV data
// Function to bulk update the database with delay
async function bulkUpdate(data) {
    const updates = data.map(row => ({
        upc: row.UPC,
        quantity: parseInt(row.Qty, 10)
    }));

    console.log('Updating these items:', updates); // Log updates

    for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        try {
            const { data, error } = await supabase
                .from('items')
                .update({ quantity: update.quantity })
                .eq('upc', update.upc);

            if (error) {
                console.error(`Error updating item with UPC ${update.upc}:`, error);
            } else {
                console.log(`Successfully updated item with UPC ${update.upc}`);
            }
        } catch (error) {
            console.error(`Unexpected error for UPC ${update.upc}:`, error);
        }

        // Add a 1-second delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    alert('CSV data processed successfully!');
    fetchItems(); // Refresh the items list
}



// Attach event listeners
document.getElementById('add-item-btn').addEventListener('click', addItem);
document.getElementById('csv-upload').addEventListener('change', processCSV);
document.getElementById('upload-csv-btn').addEventListener('click', () => {
    document.getElementById('csv-upload').click();
});

// Load items on page load
fetchItems();
