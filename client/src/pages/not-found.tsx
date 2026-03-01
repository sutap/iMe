import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#e6e8d4' }}>
      <Card className="w-full max-w-md mx-4 border-0 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#c4a882' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#3d3d2e' }}>Page Not Found</h1>
          <p className="text-sm mb-4" style={{ color: '#8a8a72' }}>
            The page you're looking for doesn't exist.
          </p>
          <Link href="/">
            <a className="inline-block px-6 py-2 text-sm font-medium text-white rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7d9b6f' }}>
              Go Home
            </a>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
