"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Search = () => {
  const [search, setSearch] = useState("")

  const router = useRouter()

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    router.push(`/barbershop?search=${search}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="Faça sua busca..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit">
        <SearchIcon />
      </Button>
    </form>
  )
}

export default Search
