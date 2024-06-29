export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      await res.unstable_revalidate("/app/(central)/cultos");
      return res.json({ revalidated: true });
    } catch (err) {
      return res.status(500).send("Error revalidating");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
