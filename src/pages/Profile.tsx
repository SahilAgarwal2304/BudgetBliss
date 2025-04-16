
import { Helmet } from "react-helmet";
import Layout from "@/components/layout/Layout";
import UserProfile from "@/components/profile/UserProfile";

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile | BudgetBliss</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
          <UserProfile />
        </div>
      </Layout>
    </>
  );
};

export default Profile;
