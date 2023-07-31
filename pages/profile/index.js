// pages/profile/index.js
// This code generates the profile page for the inBDPA project. 
// 
// It includes a function called "getServerSideProps" that retrieves server-side data for the profile page. 
// 
// The function returns props and a redirect object. The redirect object specifies where the user should be redirected if they are not logged in. 
// 
// The "run" function is the default export and is used to run the profile page.
export async function getServerSideProps() {
  return {
    props: {},
    redirect: {
      destination: '/auth/login?error="You will need to login to view that page"',
      permanent: false,
    },
  };
}
export default function run(){
  getServerSideProps;
}
