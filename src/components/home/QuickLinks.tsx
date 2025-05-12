
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface QuickLinkCardProps {
  to: string;
  title: string;
}

const QuickLinkCard = ({ to, title }: QuickLinkCardProps) => (
  <Link to={to}>
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center justify-center text-center h-full">
        <span className="font-medium">{title}</span>
      </CardContent>
    </Card>
  </Link>
);

const QuickLinks = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Quick Links</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLinkCard to="/academics" title="Academic Programs" />
          <QuickLinkCard to="/facilities" title="Campus Facilities" />
          <QuickLinkCard to="/hostel" title="Hostel Information" />
          <QuickLinkCard to="/results" title="Student Results" />
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
