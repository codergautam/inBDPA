import { getInfo } from "@/utils/api";

export default async function handler(req, res) {
    // TODO: Make sure user is admin!!
    let data = await getInfo();
    res.json(data);
}