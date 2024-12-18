import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js';

const SUPABASE_URL = 'https://gmcmakoecwxkgtabkjwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY21ha29lY3d4a2d0YWJrand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODkwMDUsImV4cCI6MjA1MDA2NTAwNX0.Vlik45ieDFUC0s5jaMlL_IQZ_iotb9JOqOySnJMT4aU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to process CSV file
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
// Function to bulk update the database
async function bulkUpdate(data) {
    try {
        const updates = data.map(row => ({
            upc: row.UPC,
            quantity: parseInt(row.Qty, 10)
        }));

        // Update items in Supabase
        for (const update of updates) {
            const { data, error } = await supabase
                .from('items')
                .update({ quantity: update.quantity })
                .eq('upc', update.upc);

            if (error) {
                console.error(`Error updating item with UPC ${update.upc}:`, error);
            } else {
                console.log(`Updated item with UPC ${update.upc}`);
            }
        }

        alert('CSV data processed successfully!');
        fetchItems(); // Refresh the items list
    } catch (error) {
        console.error('Error processing bulk update:', error);
        alert('Failed to process CSV data.');
    }
}

// Attach event listeners
document.getElementById('csv-upload').addEventListener('change', processCSV);
document.getElementById('upload-csv-btn').addEventListener('click', () => {
    document.getElementById('csv-upload').click();
});
