export async function getServerSideProps() {
  return {
    props: {},
    redirect: {
      destination: '/auth/login?error=You will need to login to view that page',
      permanent: false,
    },
  };
}
export default function run(){
  getServerSideProps;
}
