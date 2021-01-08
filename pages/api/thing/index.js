export default async function thisHandler(req, res) {
  await new Promise((res) => setTimeout(res, 5000));
  return res.json({ this: "thing" });
}
