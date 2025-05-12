
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HostelPage = () => {
  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Hostel Information</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Government Polytechnic Changipur provides comfortable and secure hostel facilities for both boys and girls.
          </p>
        </div>

        {/* Hostel Tabs */}
        <Tabs defaultValue="boys" className="w-full">
          <TabsList className="mb-8 w-full flex justify-center">
            <TabsTrigger value="boys" className="px-8">Boys Hostel</TabsTrigger>
            <TabsTrigger value="girls" className="px-8">Girls Hostel</TabsTrigger>
          </TabsList>
          
          {/* Boys Hostel Content */}
          <TabsContent value="boys">
            <HostelDetail 
              name="Boys Hostel"
              capacity={60}
              image="https://www.lbsim.ac.in/images/Boys-Hostel1.jpg"
              description="The Boys Hostel at Government Polytechnic Changipur provides a comfortable and conducive living environment for male students. Located within the campus premises, the hostel ensures a safe and convenient stay for students coming from distant places."
              facilities={[
                "Double occupancy rooms with individual beds and study tables",
                "24x7 electricity with power backup",
                "Common room with indoor games",
                "Reading room for quiet study",
                "Mess facility with nutritious meals",
                "Wi-Fi connectivity",
                "Regular cleaning services",
                "Filtered drinking water"
              ]}
              rules={[
                "Ragging is strictly prohibited and punishable",
                "Adherence to hostel timings is mandatory",
                "Visitors are allowed only during designated hours",
                "Possession of prohibited items is not allowed",
                "Maintain cleanliness of rooms and common areas",
                "Permission required for leaving hostel during non-college hours",
                "Disciplinary action for violation of hostel rules"
              ]}
              contactPerson="Dr. Arun Baliyan"
              contactNumber="+91 995 331 2972"
              fees="₹2300 per Year"
              additionalNotes="Priority is given to students from distant locations. Limited seats available, so early application is recommended."
            />
          </TabsContent>
          
          {/* Girls Hostel Content */}
          <TabsContent value="girls">
            <HostelDetail 
              name="Girls Hostel"
              capacity={60}
              image="https://www.lbsim.ac.in/images/Girls-Hostel2.jpg"
              description="The Girls Hostel at Government Polytechnic Changipur provides a safe, comfortable and supportive environment for female students. Located within campus with enhanced security measures, the hostel ensures that students can focus on their studies without worry."
              facilities={[
                "Double occupancy rooms with individual beds and study tables",
                "24x7 electricity with power backup",
                "Common room with indoor games",
                "Reading room for quiet study",
                "Mess facility with nutritious meals",
                "Wi-Fi connectivity",
                "Regular cleaning services",
                "Filtered drinking water"
              ]}
              rules={[
                "Ragging is strictly prohibited and punishable",
                "Biometric attendance system in place",
                "Strict adherence to entry/exit timings",
                "Visitors allowed only in designated area during visiting hours",
                "Maintain cleanliness of rooms and common areas",
                "Written permission required for leaving hostel",
                "Disciplinary action for violation of hostel rules"
              ]}
              contactPerson="Mrs. Anita "
              contactNumber="+91 945 499 1397"
              fees="₹2500 per Year"
              additionalNotes="Priority is given to students from distant locations. Enhanced security measures including female security guards and CCTV surveillance."
            />
          </TabsContent>
        </Tabs>

        {/* Hostel Admission Process */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Hostel Admission Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Application Procedure</h3>
              <ol className="list-decimal ml-5 space-y-3">
                <li>
                  <span className="font-medium">Fill Application Form:</span>{" "}
                  Complete the hostel application form available at the college office or download from the website.
                </li>
                <li>
                  <span className="font-medium">Submit Documents:</span>{" "}
                  Attach required documents like address proof, medical certificate, and admission confirmation.
                </li>
                <li>
                  <span className="font-medium">Selection Process:</span>{" "}
                  Selection is based on distance from home, academic performance, and availability of seats.
                </li>
                <li>
                  <span className="font-medium">Fee Payment:</span>{" "}
                  Upon selection, pay the hostel fees at the college accounts office.
                </li>
                <li>
                  <span className="font-medium">Room Allocation:</span>{" "}
                  Rooms are allocated by the warden based on availability and student preferences.
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Important Dates</h3>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Application Start Date:</span>
                    <span>August 1, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Application Deadline:</span>
                    <span>September 30, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Selection List Announcement:</span>
                    <span>October 05, 2025</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Fee Payment Deadline:</span>
                    <span>October 10, 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Hostel Occupancy Date:</span>
                    <span>October 10, 2025</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-primary mb-2">Required Documents</h4>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Completed application form</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>College admission confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Address proof</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Medical fitness certificate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Passport size photographs (4 copies)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Parent/Guardian contact information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface HostelDetailProps {
  name: string;
  capacity: number;
  image: string;
  description: string;
  facilities: string[];
  rules: string[];
  contactPerson: string;
  contactNumber: string;
  fees: string;
  additionalNotes: string;
}

const HostelDetail = ({
  name,
  capacity,
  image,
  description,
  facilities,
  rules,
  contactPerson,
  contactNumber,
  fees,
  additionalNotes
}: HostelDetailProps) => {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
          />
          
          <div className="mt-6 bg-accent/10 p-4 rounded-md">
            <h3 className="font-semibold text-accent mb-2">Quick Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Capacity:</span> {capacity} students</p>
                <p><span className="font-medium">Warden:</span> {contactPerson}</p>
              </div>
              <div>
                <p><span className="font-medium">Contact:</span> {contactNumber}</p>
                <p><span className="font-medium">Fees:</span> {fees}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary">{name}</h2>
          <p className="mb-6">{description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Facilities</h3>
            <ul className="space-y-2">
              {facilities.map((facility, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{facility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Hostel Rules</h3>
            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <p className="mb-2">
                <span className="font-medium">Warden:</span> {contactPerson}
              </p>
              <p className="mb-2">
                <span className="font-medium">Phone:</span> {contactNumber}
              </p>
              <p>
                <span className="font-medium">Email:</span> gpcbijnor@gmail.com
              </p>
            </CardContent>
          </Card>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Additional Notes</h3>
            <p className="text-gray-700">{additionalNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelPage;
