// Auth functions for plain HTML project
// Requires window.supabaseClient from supabase.js

// ─── Helper: Get proper base URL for redirects ──────────────────────────────────────────
// destination: 'app' for the Growth Hub, 'login' for the sign-in page
function getAuthRedirectUrl(destination = 'app') {
  const pathname = window.location.pathname
  let baseUrl = window.location.origin

  // If in /external-Coach4u-app/ subdirectory (GitHub Pages), include it
  if (pathname.includes('external-Coach4u-app')) {
    const match = pathname.match(/^(.*?external-Coach4u-app)\//i)
    if (match) {
      baseUrl = window.location.origin + match[1]
    }
  }

  const path = destination === 'login' ? '/index.html' : '/growth/index.html'
  return baseUrl + path
}

// ─── Handle Magic Link Callback ─────────────────────────────────────────────────────
// When user clicks magic link in email, Supabase redirects back with token
(async function handleMagicLinkCallback() {
  try {
    // Check if URL contains magic link callback (hash with access_token or code parameter)
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const queryParams = new URLSearchParams(window.location.search)

    const hasAccessToken = hashParams.has('access_token')
    const hasCode = queryParams.has('code')

    if (hasAccessToken || hasCode) {
      console.log('Magic link detected, processing session...')

      // Exchange token for session
      const { data, error } = await window.supabaseClient.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        return
      }

      if (data.session) {
        console.log('Session confirmed, redirecting to Growth Hub...')
        window.location.href = getAuthRedirectUrl('app')
      }
    }
  } catch (err) {
    console.error('Error handling magic link callback:', err)
  }
})()

// ─── Sign In Function ─────────────────────────────────────────────────────────────────────
window.signIn = async function(email) {
  try {
    const { error } = await window.supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: getAuthRedirectUrl('app')
      }
    })

    if (error) {
      alert('Error signing in: ' + error.message)
      return
    }

    alert('Check your email for the magic link to sign in.')
  } catch (err) {
    console.error('Sign in error:', err)
    alert('An error occurred during sign in.')
  }
}

window.signOut = async function() {
  try {
    const { error } = await window.supabaseClient.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return
    }

    window.location.href = getAuthRedirectUrl('login')
  } catch (err) {
    console.error('Sign out error:', err)
  }
}

window.getUser = async function() {
  try {
    const { data: { user } } = await window.supabaseClient.auth.getUser()
    return user || null
  } catch (err) {
    console.error('Error getting user:', err)
    return null
  }
}

window.requireAuth = async function() {
  try {
    const { data: { user } } = await window.supabaseClient.auth.getUser()

    if (!user) {
      console.warn('No authenticated user found, redirecting to login')
      window.location.href = getAuthRedirectUrl('login')
      return null
    }

    console.log('User authenticated:', user.email)
    return user
  } catch (err) {
    console.error('Error checking auth:', err)
    window.location.href = getAuthRedirectUrl('login')
  }
}

// Listen for auth state changes on page load
window.supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session && session.user && session.user.id) {
    const pathname = window.location.pathname
    const isLoginPage = pathname.match(/\/external-Coach4u-app\/index\.html$/i)
      || pathname.match(/\/external-Coach4u-app\/?$/i)
      || (pathname === '/index.html')
      || (pathname === '/')

    if (isLoginPage) {
      console.log('User signed in, redirecting to Growth Hub...')
      setTimeout(() => {
        window.location.href = getAuthRedirectUrl('app')
      }, 500)
    }
  }
})
