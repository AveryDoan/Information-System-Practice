import { PortalLogin } from '../../components/dashboard/PortalLogin'
import { HERO_PHOTOS } from '../../lib/heroPhotos'

export function AdminLogin() {
  return (
    <PortalLogin
      heading="NT Tourism System Admin"
      subheading="Sign in with your administrator account."
      redirectTo="/admin"
      photo={HERO_PHOTOS.redCentre}
    />
  )
}
