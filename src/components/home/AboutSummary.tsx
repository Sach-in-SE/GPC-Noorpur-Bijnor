
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutSummary = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">About Our College</h2>
      <p className="mb-4">
        Government Polytechnic Changipur, established in 2013-14, is a premier 
        institution for technical education in Bijnor, Uttar Pradesh. We offer 
        three-year diploma programs in Computer Science & Engineering, Civil Engineering, 
        and Textile Engineering.
      </p>
      <p className="mb-4">
        Affiliated to the Board of Technical Education, Uttar Pradesh, our institution 
        is committed to providing quality technical education and producing 
        skilled professionals ready to meet industry demands.
      </p>
      <Button asChild className="mt-2">
        <Link to="/about">Read More About Us</Link>
      </Button>
    </div>
  );
};

export default AboutSummary;
