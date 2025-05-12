
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const ResultPage = () => {
  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Results</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access your semester examination results through the official Board of Technical Education portal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>BTEUP Result Portal</CardTitle>
              <CardDescription>
                Check your semester results by entering your Enrollment number in the official BTEUP portal
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="mb-6">
                The Board of Technical Education, Uttar Pradesh (BTEUP) conducts polytechnic diploma 
                examinations and publishes results on their official portal. Click the button 
                below to access the official result portal.
              </p>
              
              <Button asChild className="flex items-center gap-2 mb-8">
                <a 
                  href="https://result.bteexam.com/Odd_Semester/main/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span>Access Result Portal</span>
                  <ExternalLink size={18} />
                </a>
              </Button>
              
              <div className="bg-blue-50 p-4 rounded-md w-full">
                <h3 className="font-semibold text-primary mb-2">How to Check Your Result:</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Click on the "Access Result Portal" button above</li>
                  <li>Click on View Odd/Even Semester Result link</li>
                  <li>Enter your enrollment number</li>
                  <li>Enter your Date of Birth</li>
                  <li>Click on "Submit" to view your result</li>
                  <li>You can download or print your result for future reference</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 bg-accent/10 p-4 rounded-md">
            <h3 className="font-semibold text-accent mb-2">Need Help?</h3>
            <p className="mb-2">
              If you encounter any issues while accessing your results, please contact the 
              college examination cell:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> gpcbijnor@gmail.com<br />
              <strong>Phone:</strong> +91 783 884 5217<br />
              <strong>Office Hours:</strong> Monday to Saturday, 10:00 AM to 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
