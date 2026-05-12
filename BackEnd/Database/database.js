import OracleDB from 'oracledb';
import { config } from './databaseConfiguration.js';

export async function start() {
  await OracleDB.createPool(config);
}

export async function stop() {
  await OracleDB.getPool().close(0);
}

export async function queryExecute(statement, binds = [], opts = {}) {
  let conn;
  const executeOptions = {
    ...opts,
    outFormat: OracleDB.OUT_FORMAT_OBJECT,
    autoCommit: opts.autoCommit ?? true
  };

  try {
    conn = await OracleDB.getConnection();
    return await conn.execute(statement, binds, executeOptions);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
