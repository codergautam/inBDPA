import { BASE_URL, sendRequest } from "./hsccInit";
import { Profile } from "../mongo/mongoInit";
import { updateUser } from "./userEndpoints";

export default async function changeProfileEmail(user_id, email) {

    let data = await updateUser(user_id, {email})
    console.log(data)
    if(data.success) {
        try {
            const updatedProfile = await Profile.findOneAndUpdate(
                { user_id }, // find a document with this filter
                { email }, // document to insert when nothing was found
                { new: true, upsert: true } // options
            );
        } catch (error) {
            console.log('Error while trying to update profile link: ', error);
            return {success: false, error}
        }
        return data
    } else {
        return data
    }
}
