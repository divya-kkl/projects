let users = []; // Temporary storage (resets on restart)

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(users);
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const { name, email, password } = JSON.parse(body);
        if (!name || !email || !password) {
          res.status(400).json({ error: "All fields are required" });
          return;
        }
        const newUser = { name, email, password };
        users.push(newUser);
        res.status(201).json(newUser);
      } catch (e) {
        res.status(400).json({ error: "Invalid JSON" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
