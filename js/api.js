// api.js — lightweight fetch wrapper (placeholder)
const API = {
  get: async (url) => {
    const res = await fetch(url);
    return res.json();
  },
  post: async (url, data) => {
    const res = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    return res.json();
  }
};

window.HBApi = API;
