import { Card, CardContent } from "@/components/ui/card";

// Import images using relative paths
import principalImg from "../images/principal.png";
import manishImg from "../images/Mr. Dalchand.png"; 
import siddharthImg from "../images/siddharth.png";

const AboutPage = () => {
  return (
    <div className="py-8">
      <div className="container">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Our Institution</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Government Polytechnic Changipur is committed to providing quality technical education
            and producing skilled professionals ready to meet industry demands.
          </p>
        </div>

        {/* History section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Our History</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <p className="mb-4">
                Government Polytechnic Changipur was established in 2014 as part of the 
                initiative to expand technical education in Uttar Pradesh. Located in 
                Noorpur, Bijnor, the institution has grown significantly over the decades.
              </p>
              <p className="mb-4">
                Starting with just one department, the institution has expanded to offer 
                diploma programs in Computer Science & Engineering, Civil Engineering, and 
                Textile Engineering, meeting the growing demand for skilled technical professionals 
                in these fields.
              </p>
              <p>
                Over the years, the institution has maintained high standards of education 
                and has produced thousands of skilled professionals who are contributing 
                to various sectors of the economy.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWKTPjHisJcFRO2953jQNtU4akpA-Nbxp0o2GMJJ6iwxK1a9cWRcPGk-Ed38CiL4ElimI&usqp=CAU" 
                alt="College Building" 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">Our Mission</h3>
                <p>
                  To provide quality technical education that prepares students for successful 
                  careers in industry and business by developing their technical skills, 
                  knowledge, and attitudes necessary to succeed in today's competitive 
                  global environment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">Our Vision</h3>
                <p>
                  To be recognized as a center of excellence in technical education, producing 
                  competent and socially responsible technical professionals who contribute 
                  to the sustainable development of the nation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Administration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Administration</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <AdminProfile
              name="Mr. Ashok Kumar"
              position="Principal"
              image={principalImg}
              qualification="Ph.D. in Technical Education"
            />
            <AdminProfile
              name="Mr. Dalchand"
              position="Head of Department (CSE)"
              image={manishImg}
              qualification="M.Tech in Computer Science"
            />
            <AdminProfile
              name="Mr. Siddharth Jain"
              position="Head of Department (Civil)"
              image={siddharthImg}
              qualification="M.Tech in Civil Engineering"
            />
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Achievements & Recognition</h2>
          <div className="space-y-4">
            <AchievementItem
              year="2022"
              title="AICTE Recognition for Best Polytechnic in Region"
              description="Recognized for excellence in technical education and infrastructure development."
            />
            <AchievementItem
              year="2020"
              title="Best Placement Record Award"
              description="Recognized for achieving the highest placement percentage among polytechnics in Uttar Pradesh."
            />
            <AchievementItem
              year="2018"
              title="Infrastructure Excellence Award"
              description="Awarded for maintaining and developing state-of-the-art technical infrastructure."
            />
            <AchievementItem
              year="2015"
              title="Academic Excellence Award"
              description="Recognized for outstanding academic performance of students in BTEUP examinations."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

interface AdminProfileProps {
  name: string;
  position: string;
  image: string;
  qualification: string;
}

const AdminProfile = ({ name, position, image, qualification }: AdminProfileProps) => (
  <Card className="overflow-hidden">
    <div className="flex justify-center pt-4">
      <img 
        src={image} 
        alt={name} 
        className="w-32 h-32 rounded-full object-cover" 
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
    <CardContent className="p-4 text-center">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-primary font-medium">{position}</p>
      <p className="text-sm text-gray-500 mt-1">{qualification}</p>
    </CardContent>
  </Card>
);

interface AchievementItemProps {
  year: string;
  title: string;
  description: string;
}

const AchievementItem = ({ year, title, description }: AchievementItemProps) => (
  <Card>
    <CardContent className="p-4 flex gap-4">
      <div className="flex-shrink-0 bg-primary text-white px-3 py-2 rounded-md flex items-center justify-center min-w-[60px]">
        <span className="font-bold">{year}</span>
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default AboutPage;
