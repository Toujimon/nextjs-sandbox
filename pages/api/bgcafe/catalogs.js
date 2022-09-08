import { MongoClient, ServerApiVersion } from "mongodb";

export default async function handler(req, res) {
  try {
    const uri =
      "mongodb+srv://gonarrivi-sandbox:oQwedEmm4EKBAfgi@gonarrivi-sandbox.iugh7ta.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    await client.connect();
    const catalogs = client.db("bgcafeapp").collection("catalogs");
    const cursor = await catalogs.find({});
    const allValues = await cursor.toArray();

    res.json({ thing: "yeah", that: "something", allValues });

    client.close();

    return;
  } catch (error) {
    res.json({ message: "server side error found", error });
  }
}
