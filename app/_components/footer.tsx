import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card className="px-2 py-2">
        <CardContent className="text-sm text-gray-400">
          © 2024 Copyright <span className="font-bold">FSW Barber</span>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
