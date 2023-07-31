// utils/neo4j.mjs
// This code is responsible for interacting with a Neo4j database to perform various operations on users and their connections. It includes functions to check if a user exists, fetch connections of a user up to a certain depth, get connection suggestions for a user, delete a user and their connections, update a user's connections, create a new user and their connections, and find the depth of connection between two users. The code uses the neo4j-driver library to connect to the Neo4j database server and execute Cypher queries to retrieve and manipulate data. The code also uses environment variables to store sensitive information like the URI, username, and password for the database connection.
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
    console.log('Error fetching connections:', error, user_id, depth);
  } finally {
    await session.close();
  }

  return [...connections];
}
export async function getConnectionSuggestions(user_id) {
  const session = driver.session();
  let suggestedUsers = [];

  try {
    const result = await session.run(
      `MATCH (a:User {id: $user_id})-[:CONNECTS_TO]->(b:User)<-[:CONNECTS_TO]-(c:User)
       WHERE NOT (a)-[:CONNECTS_TO]->(c) AND a <> c
       RETURN c.id as id, count(b) as mutualConnections
       ORDER BY mutualConnections DESC
       LIMIT 3`,
      { user_id }
    );

    // Check if less than 3 users are returned.
    if (result.records.length < 3) {
      // Fetch some random users.
      const popularResult = await session.run(
        `MATCH (a:User)<-[:CONNECTS_TO]-(b:User)
        WHERE NOT ((b)-[:CONNECTS_TO]->(:User {id: $user_id})) AND a.id <> $user_id
        RETURN a.id as id, count(b) as connectionCount
        ORDER BY connectionCount DESC
        LIMIT ${3 - result.records.length}`,
        { user_id }
      );


      // Merge the result sets.
      result.records = [...result.records, ...popularResult.records];
    }

    // Gather the suggested users.
    for (let i = 0; i < result.records.length; i++) {
      suggestedUsers.push({
        id: result.records[i].get('id'),
        mutualConnections: result.records[i].has('mutualConnections') ? result.records[i].get('mutualConnections').toInt() : 0
      });
    }
  } catch (error) {
    console.log('Error fetching connection suggestions:', error, user_id);
  } finally {
    await session.close();
  }

  return suggestedUsers;
}




export async function deleteUser(user_id) {
  const session = driver.session();

  try {
    // First, delete all existing connections.
    let query = 'MATCH (a:User {id: $user_id})-[r:CONNECTS_TO]->() DELETE r';
    let params = { user_id };

    await session.run(query, params);

    // Then, delete the user itself.
    query = 'MATCH (a:User {id: $user_id}) DELETE a';
    await session.run(query, params);

  } catch (error) {
    console.error('Error deleting user and its connections:', error);
  } finally {
    await session.close();
  }
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

