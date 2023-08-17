import { sendRequest, BASE_URL } from "./hsccInit";

export async function getArticles(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/articles`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

export async function createArticle(article) {
  const url = `${BASE_URL}/articles`;
  return sendRequest(url, 'POST', article);
}

export async function getArticle(articleId) {
  const url = `${BASE_URL}/articles/${articleId}`;
  return sendRequest(url, 'GET');
}

export async function updateArticle(articleId, updates) {
  const url = `${BASE_URL}/articles/${articleId}`;
  return sendRequest(url, 'PATCH', updates);
}

export async function deleteArticle(articleId) {
  const url = `${BASE_URL}/articles/${articleId}`;
  return sendRequest(url, 'DELETE');
}
