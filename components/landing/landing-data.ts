import {
  BarChart3,
  Brain,
  DollarSign,
  Download,
  LineChart,
  ListPlus,
  PieChart,
  Shield,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react"

export const features = [
  {
    icon: BarChart3,
    title: "Income & Expense Tracking",
    description:
      "Effortlessly log every transaction with smart categorization. Filter, sort, and search through your full financial history.",
  },
  {
    icon: PieChart,
    title: "Visual Spending Breakdown",
    description:
      "Interactive pie charts and bar graphs show exactly where your money goes each month, broken down by category.",
  },
  {
    icon: TrendingUp,
    title: "Savings Trend Analysis",
    description:
      "Track your savings rate over time with beautiful area charts. Spot trends and stay motivated to save more.",
  },
  {
    icon: Brain,
    title: "Smart Financial Insights",
    description:
      "Automatic detection of overspending, savings rate evaluation, and income diversification analysis with actionable tips.",
  },
  {
    icon: Download,
    title: "CSV Export",
    description:
      "Export your full transaction history, or just income or expenses, to CSV for use in spreadsheets or tax software.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with industry-standard encryption, bcrypt password hashing, and secure JWT sessions.",
  },
]

export const heroSectionTrend = [
  {
    icon: TrendingUp,
    stat: "100+",
    label: "Active users tracking finances",
  },
  {
    icon: DollarSign,
    stat: "Free",
    label: "Free financial analysis",
  },
  { icon: Zap, stat: "< 2 min", label: "Average setup time" },
]

export const howItWorksSteps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with just your name, email, and a password. No credit card required.",
  },
  {
    step: "02",
    icon: ListPlus,
    title: "Log Your Transactions",
    description:
      "Add income and expenses as they happen. Categorize, date, and annotate each entry for a clear record.",
  },
  {
    step: "03",
    icon: LineChart,
    title: "Get Insights & Grow",
    description:
      "Your dashboard instantly transforms data into visual charts, a financial health score, and personalized tips.",
  },
]

export const testimonials = [
  {
    quote:
      "FinTrackr completely changed how I view my spending. The category breakdown alone saved me hundreds every month.",
    name: "Sarah Chen",
    role: "Product Designer",
    initials: "SC",
  },
  {
    quote:
      "The financial health score is genius. It gamified saving for me and I actually look forward to checking my dashboard now.",
    name: "Marcus Rivera",
    role: "Software Engineer",
    initials: "MR",
  },
  {
    quote:
      "I used to dread tax season. Now I just export my CSV files and hand them to my accountant. Couldn't be easier.",
    name: "Aisha Patel",
    role: "Freelance Writer",
    initials: "AP",
  },
]
