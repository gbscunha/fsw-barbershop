import Image from "next/image"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { signIn } from "next-auth/react"

const SignInDialog = () => {
  const handleLoginWithGoogle = () => signIn("google")

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça seu login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google
        </DialogDescription>
      </DialogHeader>

      <Button
        className="gap-1 text-lg font-bold"
        variant="outline"
        onClick={handleLoginWithGoogle}
      >
        <Image
          src="/google.svg"
          width={18}
          height={18}
          alt="Fazer login com o google"
        />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
