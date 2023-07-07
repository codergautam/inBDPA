import { getInfo } from "@/utils/api";

export default async function handler(req, res) {
    let data = await getInfo();
    res.json(data);
}