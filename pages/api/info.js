import { getInfo } from "@/utils/api";

export default async function handler(req, res) {
    if(req.session.user.type != "administrator") {
        res.json({success: false, error: "Unauthorized"})
    }

    let data = await getInfo();
    res.json(data);
}