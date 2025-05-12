
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Technical Career with Us</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          Join Government Polytechnic Changipur and become a part of our legacy of 
          excellence in technical education.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-green-600">
          <Link to="/contact">Contact For Admission</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
