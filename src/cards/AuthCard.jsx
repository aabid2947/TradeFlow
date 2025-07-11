import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
export const AuthCard = ({ children, title, subtitle }) => (
  <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-lg border-0 shadow-3xl hover:shadow-4xl transition-all duration-300 hover:scale-[1.02] rounded-2xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1987BF]/5 to-purple-500/5 opacity-50" />
    <CardHeader className="relative z-10 text-center pb-6 pt-8">
      <div className="w-16 h-16 bg-gradient-to-br from-[#1987BF] to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{title}</CardTitle>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </CardHeader>
    <CardContent className="relative z-10 px-8 pb-8">{children}</CardContent>
  </Card>
)
