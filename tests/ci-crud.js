const assert = require('node:assert/strict');

const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;

async function request(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return {
    status: response.status,
    data: await response.json()
  };
}

async function waitForApi() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const result = await request('GET', '/health');
      if (
        result.status === 200 &&
        result.data.status === 'ok' &&
        result.data.database === 'productdb'
      ) {
        console.log('API và MongoDB đã sẵn sàng');
        return;
      }
    } catch {
      // API có thể chưa mở cổng trong lúc khởi động.
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('API/MongoDB chưa sẵn sàng sau 60 giây');
}

async function main() {
  await waitForApi();

  const pid = Date.now();
  const path = `/api/products/${pid}`;

  let result = await request('POST', '/api/products', {
    pid,
    pname: 'CI Product',
    price: 100,
    quantity: 2
  });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  assert.equal(result.data.pid, pid);
  console.log('CREATE: đạt');

  result = await request('GET', path);
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.equal(result.data.pname, 'CI Product');
  assert.equal(result.data.price, 10000);
  assert.equal(result.data.quantity, 2);
  console.log('READ theo pid: đạt');

  result = await request('GET', '/api/products');
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.ok(Array.isArray(result.data));
  assert.ok(result.data.some(product => product.pid === pid));
  console.log('READ danh sách: đạt');

  result = await request('PUT', path, {
    pname: 'CI Updated',
    price: 150,
    quantity: 3
  });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.equal(result.data.pname, 'CI Updated');
  assert.equal(result.data.price, 150);
  assert.equal(result.data.quantity, 3);
  console.log('UPDATE: đạt');

  result = await request('DELETE', path);
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.equal(result.data.product.pid, pid);
  console.log('DELETE: đạt');

  result = await request('GET', path);
  assert.equal(result.status, 404, JSON.stringify(result.data));
  console.log('Xác nhận đã xóa: đạt');
}

main().catch(error => {
  console.error('Kiểm thử CRUD thất bại:', error);
  process.exitCode = 1;
});