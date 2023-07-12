import neo4j from 'neo4j-driver';
import { config } from 'dotenv';
config();

const uri = process.env.NEO4J_URI;  //  URI to neo4j database
const user = process.env.NEO4J_USERNAME;  //  username
const password = process.env.NEO4J_PASSWORD;  // password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export async function userExists(user_id) {
  const session = driver.session();
  let exists = false;

  try {
    const result = await session.run(
      'MATCH (a:User {id: $user_id}) RETURN a',
      { user_id }
    );

    if (result.records.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
  } finally {
    await session.close();
  }

  return exists;
}

export async function fetchConnections(user_id, depth) {
  const session = driver.session();
  let connections = new Set();

  try {
    // The pattern `-[:CONNECTS_TO*1..${depth}]->(b:User)` means 'find all Users that are
    // connected to a through a CONNECTS_TO relationship, with a maximum depth of depth'.
    const result = await session.run(
      `MATCH (a:User {id: $user_id})-[:CONNECTS_TO*1..${depth}]->(b:User) RETURN DISTINCT b.id`,
      { user_id }
    );

    // Gather the connections.
    for (let i = 0; i < result.records.length; i++) {
      if(result.records[i].get('b.id') != user_id) connections.add(result.records[i].get('b.id'));
    }
  } catch (error) {
    console.error('Error fetching connections:', error);
  } finally {
    await session.close();
  }

  return [...connections];
}



export async function updateUser(user_id, newConnections) {
  const session = driver.session();

  try {
    // First, delete all existing connections.
    let query = 'MATCH (a:User {id: $user_id})-[r:CONNECTS_TO]->() DELETE r';
    let params = { user_id };

    let d = await session.run(query, params);
    // Then, create the new connections.
    for (let i = 0; i < newConnections.length; i++) {
      query = 'MATCH (a:User {id: $user_id}), (b:User {id: $connection_id}) ' +
              'MERGE (a)-[:CONNECTS_TO]->(b)';
      params = { user_id, connection_id: newConnections[i] };

      let d = await session.run(query, params);
    }
  } catch (error) {
    console.error('Error updating user connections:', error);
  } finally {
    await session.close();
  }
}

export async function createUser(user_id, connections) {
  const session = driver.session();

  try {
    // First, create the user.
    let query = 'MERGE (a:User {id: $user_id})';
    let params = { user_id };

    await session.run(query, params);

    // Then, create the connections.
    for (let i = 0; i < connections.length; i++) {
      query = 'MATCH (a:User {id: $user_id}), (b:User {id: $connection_id}) ' +
              'MERGE (a)-[:CONNECTS_TO]->(b)';
      params = { user_id, connection_id: connections[i] };

      await session.run(query, params);
    }
  } catch (error) {
    console.error('Error creating user and connections:', error);
  } finally {
    await session.close();
  }
}

export async function findConnectionDepth(user_id1, user_id2) {
  const session = driver.session();
  let depth = 0;

  try {
    const result = await session.run(
      'MATCH path=shortestPath((a:User {id: $user_id1})-[:CONNECTS_TO*]-(b:User {id: $user_id2})) RETURN length(path)',
      { user_id1, user_id2 }
    );

    if (result.records.length > 0) {
      depth = result.records[0].get('length(path)').toInt();
    }
  } catch (error) {
    console.error('Error finding connection depth:', error);
  } finally {
    await session.close();
  }

  return depth;
}

