// ____________
// URL D'accès à l'API dependant de l'environnement

const API_PREFIX =
  import.meta.env.MODE === "production" ? "/api" : "http://localhost:3000";

async function getAPI(route) {
  return fetch(`${API_PREFIX}/${route}`).then((r) => r.json());
}

export { getAPI };
