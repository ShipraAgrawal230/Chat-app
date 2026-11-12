import { Moon, Sun } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { themeToggled } from '@/store/themeSlice'

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.theme)

  return (
    <IconButton
      label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => dispatch(themeToggled())}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </IconButton>
  )
}
