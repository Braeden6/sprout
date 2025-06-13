import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"
import { useState } from "react"

export function AuthPopup() {
  const { 
    isAuthPopupOpen, 
    login,  
    authError,
    isLoading,
  } = useAuthStore()

  const [sessionToken, setSessionToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(sessionToken.trim())
  }

  if (!isAuthPopupOpen) return null

  return (
    <Dialog open={isAuthPopupOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Boom Land!</DialogTitle>
          <DialogDescription>
            Please enter your session token to start your adventure with Sprout.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="session-token">Session Token</Label>
              <Input 
                id="session-token" 
                name="sessionToken" 
                type="password"
                value={sessionToken}
                onChange={(e) => setSessionToken(e.target.value)}
                placeholder="Enter your session token"
                className={authError ? "border-red-500" : ""}
                required
              />
              {authError && (
                <p className="text-sm text-red-500 mt-1">{authError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Validating...' : 'Start Adventure'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
