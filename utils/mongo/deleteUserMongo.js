import { Profile } from "./mongoInit";

export default async function deleteProfileMongo(profile_id) {
  try {
    await Profile.findOneAndRemove({ user_id: profile_id });
    console.log('Profile successfully deleted in mongo', profile_id);
    return true;
  } catch (error) {
    console.log('Error while trying to delete profile: ', error);
    return false;
  }
}