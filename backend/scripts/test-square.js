/**
 * Test Square API Connection and Get Location ID
 * Run with: node scripts/test-square.js
 */

const ACCESS_TOKEN = 'EAAAl6QMCKQ-BUrU3dMfN6J1qAdceYdvhq_skFkm1Bg28YM-IKkKChOYx6qhA-3j';

async function getSquareLocations() {
  console.log('Testing Square API connection...\n');

  try {
    const response = await fetch('https://connect.squareupsandbox.com/v2/locations', {
      method: 'GET',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Square API Error:', data.errors);
      return;
    }

    if (data.locations && data.locations.length > 0) {
      console.log('✅ Square API connection successful!\n');
      console.log('Available Locations:');
      console.log('='.repeat(50));

      data.locations.forEach((location, index) => {
        console.log(`\nLocation ${index + 1}:`);
        console.log(`  ID: ${location.id}`);
        console.log(`  Name: ${location.name}`);
        console.log(`  Status: ${location.status}`);
        console.log(`  Country: ${location.country}`);
        console.log(`  Currency: ${location.currency}`);
        if (location.address) {
          console.log(`  Address: ${location.address.address_line_1 || ''}, ${location.address.locality || ''}`);
        }
      });

      console.log('\n' + '='.repeat(50));
      console.log(`\n📋 Use this Location ID in your settings:`);
      console.log(`   ${data.locations[0].id}`);

    } else {
      console.log('No locations found. You may need to create one in the Square Dashboard.');
    }

  } catch (error) {
    console.error('Error connecting to Square:', error.message);
  }
}

getSquareLocations();
