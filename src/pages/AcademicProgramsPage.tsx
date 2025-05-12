import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import faculty images
import manishImg from "../images/Mr. Dalchand.png";
import ashishImg from "../images/Ashish Bagla.png";
import monuImg from "../images/Monu Kumar.png";
import siddharthImg from "../images/siddharth.png";
import ankitImg from "../images/Ankit Kumar.png";
import anitaImg from "../images/Anita.png";
import drPoojaImg from "../images/Pooja Rani.png";
import drArunImg from "../images/Dr. Arun Baaliyan.png";
import mrSailendraImg from "../images/Sailendra Singh.png";

const AcademicProgramsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="py-8">
      <div className="container">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Academic Programs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Government Polytechnic Changipur offers comprehensive 3-year diploma programs
            designed to prepare students for successful careers in engineering and technology.
          </p>
        </div>

        {/* Diploma structure section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">3-Year Diploma Structure</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">First Year</h3>
                <p className="mb-4 text-sm">
                  The first year focuses on building a strong foundation in engineering principles, 
                  mathematics, and basic sciences.
                </p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Applied Mathematics</li>
                  <li>Applied Physics</li>
                  <li>Applied Chemistry</li>
                  <li>Engineering Drawing</li>
                  <li>Basic Electrical Engineering</li>
                  <li>Professional Communication</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">Second Year</h3>
                <p className="mb-4 text-sm">
                  The second year introduces specialized subjects relevant to the chosen branch 
                  of engineering, with a mix of theory and practical work.
                </p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Branch-specific core subjects</li>
                  <li>Technical training</li>
                  <li>Industrial visits</li>
                  <li>Computer applications</li>
                  <li>Professional skill development</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">Third Year</h3>
                <p className="mb-4 text-sm">
                  The final year focuses on advanced topics, project work, and preparation for 
                  industry placement or higher education.
                </p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Advanced branch subjects</li>
                  <li>Major project work</li>
                  <li>Industrial training</li>
                  <li>Entrepreneurship development</li>
                  <li>Elective subjects</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Branches Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Our Engineering Branches</h2>
          <Tabs defaultValue="cse" className="w-full">
            <TabsList className="mb-6 w-full flex justify-start overflow-x-auto">
              <TabsTrigger value="cse">Computer Science & Engineering</TabsTrigger>
              <TabsTrigger value="civil">Civil Engineering</TabsTrigger>
              <TabsTrigger value="textile">Textile Engineering</TabsTrigger>
            </TabsList>
            
            {/* Computer Science & Engineering */}
            <TabsContent value="cse">
              <BranchDetail
                name="Computer Science & Engineering"
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                description="The Computer Science & Engineering diploma program provides students with a strong foundation in computer systems, programming languages, database management, networking, and software development. Our curriculum is regularly updated to keep pace with industry trends."
                curriculum={[
                  "Programming Fundamentals (C, Python, Java)",
                  "Database Management Systems",
                  "Computer Networks",
                  "Operating Systems",
                  "Web Development",
                  "Data Structures using C",
                  "Software Engineering",
                  "Development of Android Application"
                ]}
                careers={[
                  "Software Developer",
                  "Web Developer",
                  "Network Administrator",
                  "Database Administrator",
                  "System Analyst",
                  "IT Support Specialist",
                  "Software Tester",
                  "Junior Programmer"
                ]}
                faculty={[
                  {
                    name: "Mr. Dalchand",
                    position: "Head of Department",
                    expertise: "Java, Python, SQL, Networking",
                    image: manishImg
                  },
                  {
                    name: "Mr. Ashish Bagla",
                    position: "Lecturer",
                    expertise: "Computer Networks, Software Engineering",
                    image: ashishImg
                  },
                  {
                    name: "Mr. Monu Kumar",
                    position: "Lecturer",
                    expertise: "Programming Languages, Web Development",
                    image: monuImg
                  }
                ]}
              />
            </TabsContent>
            
            {/* Civil Engineering */}
            <TabsContent value="civil">
              <BranchDetail
                name="Civil Engineering"
                image="https://karpagamarch.in/demo/wp-content/uploads/2023/05/Challenges-and-Opportunities-in-Civil-Engineering-Addressing-Environmental-and-Safety-Concerns.jpeg"
                description="The Civil Engineering diploma program focuses on providing students with knowledge and skills in structural design, construction techniques, surveying, material testing, and project management. The program combines theoretical learning with extensive practical training."
                curriculum={[
                  "Structural Engineering",
                  "Building Materials and Construction",
                  "Surveying",
                  "Soil Mechanics and Foundation Engineering",
                  "Transportation Engineering",
                  "Environmental Engineering",
                  "Hydraulics and Water Resources",
                  "Construction Management"
                ]}
                careers={[
                  "Site Engineer",
                  "Structural Designer",
                  "Surveyor",
                  "Quality Control Technician",
                  "Construction Supervisor",
                  "Estimator",
                  "CAD Technician",
                  "Government Services"
                ]}
                faculty={[
                  {
                    name: "Mr. Siddharth Jain",
                    position: "Head of Department",
                    expertise: "Structural Engineering, Construction Management",
                    image: siddharthImg
                  },
                  {
                    name: "Mr. Ankit Kumar",
                    position: "Lecturer",
                    expertise: "Surveying, Transportation Engineering",
                    image: ankitImg
                  },
                  {
                    name: "Ms. Anita",
                    position: "Lecturer",
                    expertise: "Water Resources, Environmental Engineering",
                    image: anitaImg
                  }
                ]}
              />
            </TabsContent>
            
            {/* Textile Engineering */}
            <TabsContent value="textile">
              <BranchDetail
                name="Textile Engineering"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZPov67dd-DpbyH43KKP_i70BH27RG3bnTW0TdVNYfzpTNbLsF_60CKm2EaOV4udQNorQ&usqp=CAU"
                description="The Textile Engineering diploma program covers all aspects of the textile manufacturing process, from fiber to fabric. Students learn about yarn manufacturing, fabric production, textile testing, textile chemistry, and apparel production technologies with hands-on training using modern equipment."
                curriculum={[
                  "Yarn Manufacturing Technology",
                  "Fabric Manufacturing Technology",
                  "Textile Chemistry & Processing",
                  "Apparel Production Technology",
                  "Textile Testing and Quality Control",
                  "Textile Design",
                  "Technical Textiles",
                  "Textile Mill Management"
                ]}
                careers={[
                  "Production Supervisor",
                  "Quality Control Technician",
                  "Textile Designer",
                  "Textile Laboratory Technician",
                  "Merchandiser",
                  "Garment Technologist",
                  "Textile Consultant",
                  "Production Planning Executive"
                ]}
                faculty={[
                  {
                    name: "Dr. Pooja Rani",
                    position: "Head of Department",
                    expertise: "Textile Manufacturing, Technical Textiles",
                    image: drPoojaImg
                  },
                  {
                    name: "Dr. Arun Baliyan",
                    position: "Lecturer",
                    expertise: "Textile Chemistry, Dyeing and Printing",
                    image: drArunImg
                  },
                  {
                    name: "Mr. Sailendra Kumar",
                    position: "Lecturer(Guest)",
                    expertise: "Apparel Production, Textile Design",
                    image: mrSailendraImg
                  }
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

interface FacultyMemberProps {
  name: string;
  position: string;
  expertise: string;
  image: string;
}

interface BranchDetailProps {
  name: string;
  image: string;
  description: string;
  curriculum: string[];
  careers: string[];
  faculty: FacultyMemberProps[];
}

const BranchDetail = ({ name, image, description, curriculum, careers, faculty }: BranchDetailProps) => {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold mb-4 text-primary">{name}</h3>
          <p className="mb-6">{description}</p>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3">Curriculum Highlights</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {curriculum.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">Career Opportunities</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {careers.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold mb-5 border-b pb-2">Faculty Members</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculty.map((member, index) => (
            <Card key={index}>
              <div className="flex justify-center pt-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <CardContent className="p-4 text-center">
                <h5 className="font-bold">{member.name}</h5>
                <p className="text-primary text-sm">{member.position}</p>
                <p className="text-xs text-gray-500 mt-1">Expertise: {member.expertise}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicProgramsPage;
