import { PortalLogin } from '../../components/dashboard/PortalLogin'
import { HERO_PHOTOS } from '../../lib/heroPhotos'

export function StaffLogin() {
  return (
    <PortalLogin
      heading="NT Tourism Staff Portal"
      subheading="Sign in with your NTG staff account."
      redirectTo="/staff"
      photo={HERO_PHOTOS.litchfield}
    />
  )
}
