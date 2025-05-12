
import { Card, CardContent } from "@/components/ui/card";
import { Library, BookOpen, Dumbbell, Bus, Laptop, Beaker, Building } from "lucide-react";

const FacilitiesPage = () => {
  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Facilities</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Government Polytechnic Changipur provides state-of-the-art facilities to support academic excellence and student development.
          </p>
        </div>

        {/* Facilities Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <FacilityCard 
            icon={<Library size={28} />}
            title="Library"
            description="Extensive collection of books, journals, and digital resources"
            color="bg-blue-500"
          />
          <FacilityCard 
            icon={<Beaker size={28} />}
            title="Laboratories"
            description="Modern labs equipped with the latest technology"
            color="bg-green-500"
          />
          <FacilityCard 
            icon={<Laptop size={28} />}
            title="Computer Center"
            description="High-performance computers with high-speed internet"
            color="bg-purple-500"
          />
          <FacilityCard 
            icon={<Dumbbell size={28} />}
            title="Sports Facilities"
            description="Indoor and outdoor sports amenities for physical development"
            color="bg-red-500"
          />
          <FacilityCard 
            icon={<Building size={28} />}
            title="Hostel"
            description="Separate hostels for boys and girls with modern amenities"
            color="bg-amber-500"
          />
          <FacilityCard 
            icon={<Bus size={28} />}
            title="Transportation"
            description="Regular bus service connecting major locations"
            color="bg-indigo-500"
          />
        </div>

        {/* Library Section */}
        <FacilitySection
          title="Library"
          description="Our college library is a comprehensive resource center that serves the academic needs of students and faculty. The library maintains an extensive collection of books, journals, magazines, and digital resources covering all branches of engineering and general studies."
          image="https://pcge.parishkar.org/wp-content/uploads/2023/04/IMG_2675-scaled.jpg"
          features={[
            "Over 15,000 books covering technical and non-technical subjects",
            "Subscription to major technical journals and magazines",
            "Digital library with access to e-books and online journals",
            "Spacious reading hall with seating capacity of 100 students",
            "Book bank facility for economically weaker students",
            "Photocopying and printing services"
          ]}
        />

        {/* Laboratories Section */}
        <FacilitySection
          title="Laboratories"
          description="Our institution houses state-of-the-art laboratories for each department, equipped with modern facilities that provide students with hands-on learning experiences. The labs are regularly updated to keep pace with technological advancements."
          image="https://dnrcollege.org/en/wp-content/uploads/photo-gallery/Gallery/Chemistry-Laboratory-Photos/Chemistry-Laboratory-Photos-002.jpg?bwg=1556944411"
          features={[
            "Computer Science labs with latest hardware and software",
            "Civil Engineering labs for material testing and surveying",
            "Textile Engineering labs with modern machinery",
            "Physics and Chemistry labs for foundational sciences",
            "Workshop facilities for practical training",
            "Project labs for final year students"
          ]}
          reversed={true}
        />

        {/* Sports Facilities */}
        <FacilitySection
          title="Sports Facilities"
          description="We understand the importance of physical activity for overall development. Our college offers excellent sports facilities to encourage students to participate in various sports activities and maintain a healthy lifestyle."
          image="https://www.rset.edu.in/gscc/wp-content/uploads/sites/8/2020/02/1481630253_1_n.jpg"
          features={[
            "Outdoor cricket and football fields",
            "Basketball and volleyball courts",
            "Indoor facilities for table tennis and badminton",
            "Well-equipped gymnasium with modern equipment",
            "Regular sports competitions and events",
            "Dedicated sports instructor for guidance and training"
          ]}
        />

        {/* Transportation */}
        <FacilitySection
          title="Transportation"
          description="To facilitate easy commuting for students and staff, the college provides transportation services connecting major points in Meerut city to the college campus."
          image="https://images.unsplash.com/photo-1570125909232-eb263c188f7e"
          features={[
            "Fleet of college buses operating on multiple routes",
            "Comfortable and safe transportation",
            "Affordable transportation fees",
            "Regular maintenance of vehicles",
            "GPS tracking for real-time location updates",
            "Dedicated transportation staff for assistance"
          ]}
          reversed={true}
        />
      </div>
    </div>
  );
};

interface FacilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FacilityCard = ({ icon, title, description, color }: FacilityCardProps) => (
  <Card className="hover:shadow-lg transition-shadow h-full">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className={`${color} p-3 rounded-full text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

interface FacilitySectionProps {
  title: string;
  description: string;
  image: string;
  features: string[];
  reversed?: boolean;
}

const FacilitySection = ({ title, description, image, features, reversed = false }: FacilitySectionProps) => (
  <section className="mb-16">
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8`}>
      <div className="md:w-1/2">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
        />
      </div>
      
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
        <p className="mb-6 text-gray-700">{description}</p>
        
        <h3 className="font-bold mb-3">Key Features:</h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default FacilitiesPage;
