import { getUserByEmail, updateUser } from "queries/user";

const handler = async (req, res) => {
  const { email } = req.query;

  if (req.method === "POST") {
    try {
      await updateUser({ where: { email } }, req.body);
      return res.status(200).send();
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }

  if (req.method === "GET") {
    try {
      const user = await getUserByEmail(email);
      return res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }
};

export default handler;
