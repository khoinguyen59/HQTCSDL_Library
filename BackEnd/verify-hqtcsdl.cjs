const http = require('http');

function testPost(path, body, label) {
  return new Promise((resolve) => {
    const data = new URLSearchParams(body).toString();
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: '/db-api/' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        console.log(`[${label}] HTTP ${res.statusCode}: ${raw}`);
        resolve();
      });
    });
    req.on('error', (e) => { console.log(`[${label}] ERROR: ${e.message}`); resolve(); });
    req.write(data);
    req.end();
  });
}

function testGet(path, label) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/db-api/' + path, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        const preview = raw.length > 120 ? raw.slice(0, 120) + '...' : raw;
        console.log(`[${label}] HTTP ${res.statusCode}: ${preview}`);
        resolve();
      });
    }).on('error', (e) => { console.log(`[${label}] ERROR: ${e.message}`); resolve(); });
  });
}

(async () => {
  console.log('=== GET tests ===');
  await testGet('hqtcsdl/dashboard', 'Dashboard');
  await testGet('hqtcsdl/books', 'Books');
  await testGet('hqtcsdl/readers', 'Readers');
  await testGet('hqtcsdl/loans', 'Loans');

  console.log('\n=== POST error tests ===');

  // 1. Missing fields
  await testPost('hqtcsdl/readers', {}, 'Missing fields');

  // 2. Duplicate key (ORA-00001) - PM000001 + S000001 already exists
  await testPost('hqtcsdl/loan-items', { loanId: 'PM000001', bookId: 'S000001', quantity: 1 }, 'Duplicate key');

  // 3. Invalid reference (ORA-02291) - non-existent reader
  await testPost('hqtcsdl/loans', { readerId: 'DG_FAKE_999', employeeId: 'NV000001', dueDate: '2026-12-31' }, 'Bad reference');

  console.log('\n=== Done ===');
})();
