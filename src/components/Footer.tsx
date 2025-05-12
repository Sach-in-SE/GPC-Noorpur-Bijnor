
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <div className="flex items-start mb-3">
              <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" />
              <p>Government Polytechnic Changipur, Noorpur, Bijnor is located in Changipur village, about 50 km from Bijnor on Moradabad Highway.</p>
            </div>
            <div className="flex items-center mb-3">
              <Phone size={20} className="mr-3 flex-shrink-0" />
              <p>+91 783 884 5217</p>
            </div>
            <div className="flex items-center">
              <Mail size={20} className="mr-3 flex-shrink-0" />
              <p>gpcbijnor@gmail.com</p>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Important  Links</h3>
            <ul className="space-y-2">
              <li><Link to="https://bteup.ac.in/webapp/home.aspx" className="hover:text-accent transition">BTEUP</Link></li>
              <li><Link to="https://urise.up.gov.in/student/login" className="hover:text-accent transition">URISE</Link></li>
              <li><Link to="http://upted.gov.in/hi" className="hover:text-accent transition">UP TED</Link></li>
              <li><Link to="https://www.aicte-india.org/" className="hover:text-accent transition">AICTE</Link></li>
              <li><Link to="https://up.gov.in/en" className="hover:text-accent transition">UP GOVT</Link></li>
              <li><a href="https://result.bteexam.com/Odd_Semester/main/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">Results</a></li>
            </ul>
          </div>

          {/* Column 3 - Programs */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Our Programs</h3>
            <ul className="space-y-2">
              <li><Link to="/academics" className="hover:text-accent transition">Computer Science & Engineering</Link></li>
              <li><Link to="/academics" className="hover:text-accent transition">Civil Engineering</Link></li>
              <li><Link to="/academics" className="hover:text-accent transition">Textile Engineering</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#154275] py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Government Polytechnic Changipur. All rights reserved.</p>
            <p className="text-sm mt-2 md:mt-0">
              Affiliated to Board of Technical Education, Uttar Pradesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
