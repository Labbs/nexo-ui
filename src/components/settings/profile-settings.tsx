import { useState, useEffect } from 'react'
import { User, Mail, Lock, Globe, Moon, Sun, Monitor, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/i18n/LanguageContext'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from '@/i18n'

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
]

export function ProfileSettings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('settings')
  const { language, setLanguage, isChangingLanguage } = useLanguage()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      const profile = user as Record<string, unknown>
      const username = (profile.username as string) || ''
      const [first = '', ...rest] = username.split(' ')
      setFirstName(first)
      setLastName(rest.join(' '))
      setEmail(user.email || '')
      const prefs = profile.preferences as Record<string, unknown> | undefined
      setTimezone((prefs?.timezone as string) || 'UTC')
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const { apiClient } = await import('@/api/client')
      await apiClient.put('/user/profile', {
        username: `${firstName} ${lastName}`.trim() || undefined,
        preferences: { timezone },
      })
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('password.mismatch'))
      return
    }
    setIsChangingPassword(true)
    try {
      // TODO: Implement API call to change password
      console.log('Changing password')
      await new Promise(resolve => setTimeout(resolve, 500))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('profile.title')}
          </CardTitle>
          <CardDescription>
            {t('profile.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('profile.firstName')}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder={t('profile.firstNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('profile.lastName')}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={t('profile.lastNamePlaceholder')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('profile.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('profile.emailPlaceholder')}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? t('profile.saving') : t('profile.saveChanges')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('password.title')}
          </CardTitle>
          <CardDescription>
            {t('password.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('password.currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('password.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('password.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {isChangingPassword ? t('password.submitting') : t('password.submit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('preferences.title')}
          </CardTitle>
          <CardDescription>
            {t('preferences.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t('preferences.timezone')}</Label>
            <Select value={timezone} onValueChange={async (value) => {
              setTimezone(value)
              try {
                const { apiClient } = await import('@/api/client')
                await apiClient.put('/user/profile', {
                  preferences: { timezone: value },
                })
              } catch (error) {
                console.error('Failed to save timezone:', error)
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('preferences.selectTimezone')} />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('preferences.language')}
            </Label>
            <div className="flex gap-2">
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value as SupportedLanguage).then(() => {
                    window.location.reload()
                  })
                }}
                disabled={isChangingLanguage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('preferences.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {LANGUAGE_LABELS[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('preferences.theme')}</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                {t('common:theme.light')}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                {t('common:theme.dark')}
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                {t('common:theme.system')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
