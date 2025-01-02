import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import xlsx from 'xlsx';
import { connectToDB, db } from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload and process an Excel file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', jsonData: [] });
    }

    console.log('File received:', req.file.originalname);
    console.log('Buffer size:', req.file.buffer.length);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON with raw values
    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false });

    console.log('Parsed data:', jsonData);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: 'No valid data found in the file', jsonData: [] });
    }

    // Insert data into the database as-is, keeping dates as strings
    const collection = db.collection('companies');
    await collection.insertMany(jsonData);

    res.status(200).json({
      message: 'File processed and data inserted into database successfully',
      jsonData: jsonData,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', jsonData: [] });
  }
});


// Add or update a company's form data
app.post('/companyform', upload.none(), async (req, res) => {
  try {
    const { companyName, ...formData } = req.body;

    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    const companyCollection = db.collection('companies');
    const existingCompany = await companyCollection.findOne({ companyName });

    if (existingCompany) {
      await companyCollection.updateOne({ companyName }, { $set: { ...formData } });
      return res.status(200).json({ success: true, message: 'Company data updated successfully!' });
    }

    await companyCollection.insertOne({ companyName, ...formData });
    res.status(200).json({ success: true, message: 'Company data inserted successfully!' });
  } catch (error) {
    console.error('Error inserting company data:', error);
    res.status(500).json({ success: false, message: 'An error occurred.', error: error.message });
  }
});

// Fetch all companies
app.get('/companyformlist', async (req, res) => {
  try {
    console.log('Fetching companies from database...');
    const companyList = await db.collection('companies')
      .find({}, { projection: { companyName: 1, location: 1, email: 1, comments: 1 } }) // Fetch only required fields
      .toArray();

    if (!companyList.length) {
      console.log('No companies found in the database.');
      return res.status(404).json({ message: 'No companies available.' });
    }

    console.log('Fetched company list:', companyList); // Log fetched data
    res.status(200).json(companyList);
  } catch (error) {
    console.error('Error fetching company form list:', error);
    res.status(500).json({ error: 'Failed to fetch company form list.' });
  }
});



// Fetch specific company data
app.get('/companydata', async (req, res) => {
  try {
    const { companyName } = req.params;
    const companyData = await db.collection('companies').findOne({ companyName });

    if (!companyData) {
      return res.status(404).json({ error: `Company ${companyName} not found.` });
    }

    res.status(200).json(companyData);
  } catch (error) {
    console.error(`Error fetching data for company ${companyName}:`, error);
    res.status(500).json({ error: 'Failed to fetch company data.' });
  }
});

// Update company data
app.put('/companydata/:companyName', async (req, res) => {
  const { companyName } = req.params;
  const updatedDetails = req.body;
  try {
    const result = await db.collection('companies').updateOne(
      { companyName },
      { $set: updatedDetails }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.status(200).json({ message: 'Company updated successfully.' });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company.' });
  }
});

// Delete company data
app.delete('/companydata/:companyName', async (req, res) => {
  const { companyName } = req.params;
  try {
    const result = await db.collection('companies').deleteOne({ companyName });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company.' });
  }
});


// Fetch all events

app.get('/events', async (req, res) => {
  try {
    const events = await db.collection('companies').find().toArray();

    // Update the date field to the correct format
    events.forEach(event => {
      if (event.date) {
        const date = new Date(event.date);
        if (!isNaN(date)) {
          event.date = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        } else {
          console.warn(`Invalid date for event: ${JSON.stringify(event)}`);
          event.date = null; // Set to null if date is invalid
        }
      }
    });

    res.status(200).send(events); // Send the data directly
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send({ error: 'Failed to fetch events.' });
  }
});


// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
connectToDB(() => {
  app.listen(8000, () => {
    console.log('Server running on port 8000');
  });
});
