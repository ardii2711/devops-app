const request = require('supertest');
const app = require('../server');

describe('Pengujian Endpoint Task API', () => {
  afterAll(async () => {
    await app.pool.end();
  });

  test('GET / harus mengembalikan status 200 dan pesan berjalan normal', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /health harus memastikan koneksi ke PostgreSQL aktif', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.database).toBe('terhubung ke PostgreSQL');
  });

  test('GET /tasks harus mengembalikan daftar tugas dalam bentuk array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /tasks tanpa title harus ditolak dengan status 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });

  test('POST /tasks dengan title valid harus menyimpan tugas baru (status 201)', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Tugas dari pengujian otomatis Jest' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Tugas dari pengujian otomatis Jest');
  });
});