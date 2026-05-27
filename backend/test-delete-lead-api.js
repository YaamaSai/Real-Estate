const testApi = async () => {
  try {
    const baseURL = 'http://localhost:5000/api';

    // 1. Log in to get token
    console.log('Logging in to get JWT token...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@bridl360.com',
        password: 'DevCheck360!'
      })
    });

    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(`Login failed: ${loginRes.status} - ${errText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Successfully logged in. Token acquired.');

    // 2. Create a temporary lead via API
    console.log('Creating a temporary lead via API...');
    const createRes = await fetch(`${baseURL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'API Temp Lead',
        email: 'api-temp@test.com',
        phone: '9876543210',
        message: 'Testing API delete route.',
        type: 'Inquiry',
        status: 'New'
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Create lead failed: ${createRes.status} - ${errText}`);
    }

    const createData = await createRes.json();
    const leadId = createData._id;
    console.log(`Created lead with ID: ${leadId}`);

    // 3. Delete the lead via API
    console.log(`Attempting to delete lead ${leadId} via protected API...`);
    const deleteRes = await fetch(`${baseURL}/leads/${leadId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      throw new Error(`Delete lead failed: ${deleteRes.status} - ${errText}`);
    }

    const deleteData = await deleteRes.json();
    console.log('Delete response from backend:', deleteData);

    // 4. Verify it was deleted
    console.log('Verifying lead deletion by fetching all leads...');
    const getRes = await fetch(`${baseURL}/leads`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      throw new Error(`Get leads failed: ${getRes.status} - ${errText}`);
    }

    const getData = await getRes.json();
    const exists = getData.some(l => l._id === leadId);
    console.log(`Does lead still exist? ${exists ? 'YES (FAIL)' : 'NO (SUCCESS)'}`);

    process.exit(0);
  } catch (err) {
    console.error('API Request Failed:', err.message);
    process.exit(1);
  }
};

testApi();
