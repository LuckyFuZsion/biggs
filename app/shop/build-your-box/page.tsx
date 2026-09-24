import { redirect } from 'next/navigation';

// Build Your Box now lives as a section on the main Shop page.
// This route is kept so any existing links/bookmarks still land in the right place.
export default function BuildYourBoxRedirect() {
  redirect('/shop#build-your-box');
}
