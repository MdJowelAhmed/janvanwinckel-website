import ContactForm from "../contactUs/ContactUs";
import SubscriptionBeforeLogin from "../subscriptionBeforLogin/SubscriptionBeforeLogin";
import AboutUs from "./AboutUs";
import Banner from "./Banner";
import FaqSection from "./FaqSection";
import HowItWork from "./HowItWork";
import Newsletter from "./Newsletter";
import WhyChooseUs from "./WhyChooseUs";

const HomePageContainer = () => {
  return (
    <div>
      <Banner />
      <AboutUs />
      <HowItWork />
      {/* <WhyChooseUs /> */}
      <SubscriptionBeforeLogin />
      <ContactForm />
      {/* <FaqSection /> */}
      {/* <Newsletter /> */}

      {/* <YogaQuotePage />
      <TodaysVideo />
      <ComingSoon />
      <DailyInspiration />
      <BrowseByCategory />
      <NewClasses /> */}
    </div>
  );
};

export default HomePageContainer;
