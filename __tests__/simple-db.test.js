const fs = require('fs/promises');
const crypto = require ('crypto');
const path = require('path');
const SimpleDb = require('../lib/simple-db');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it.only('GET:id returns object by id', async () => {
    const dogs = {
      name: 'Bear', age: 1
    };
    const id = crypto.randomBytes(8).toString('hex');
    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(dogs));
    const db = new SimpleDb(TEST_DIR);
    const result = await db.get(id);
    expect(result).toEqual(dogs);
  });

  it('save should save an object', async () => {
    const objToSave = {
      name: 'bubbles',
      age: 'old'
    };
    const db = new SimpleDb(TEST_DIR);

    const obj = await db.save(objToSave);

    expect(await db.get(obj.id)).toEqual({ ...objToSave, id: expect.any(String) });
  });

  it('getall() should return all objects in directory', async () => {
    const objects = [
      {
        name: 'karen',
        age: 70,
      },
      {
        name: 'kelly',
        age: 49,
      },
      {
        name: 'sharon',
        age: 63,
      },
    ];

    const db = new SimpleDb(TEST_DIR);

    objects.forEach(async object => {
      await db.save(object);
    });

    expect(await db.getAll()).toEqual([
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      },
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      },
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      }
    ]);
  });
});

